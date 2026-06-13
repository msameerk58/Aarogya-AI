import { NextResponse } from "next/server";
import { analyzeSymptoms } from "@/lib/dataset-engine";
import { generateChatResponse } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const { messages, language, state, age, gender } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages array" }, { status: 400 });
    }

    // ── STEP 1: Dataset engine always runs (instant, offline, accurate risk scores) ──
    const datasetResult = analyzeSymptoms(
      messages,
      language || "English",
      state    || "Uttar Pradesh",
      age      || 35,
      gender   || "Unknown"
    );

    // ── STEP 2: Try Groq for natural conversational text ──────────────────────
    const detectedLanguage = datasetResult.detectedLanguage;

    // Gate: only allow risk scores after enough user messages
    const userMessageCount = messages.filter((m: { role: string }) => m.role === "user").length;
    const allowReport = userMessageCount >= 3;

    let finalContent = datasetResult.content;

    try {
      const groqResult = await generateChatResponse(messages, language || "English");

      // Use Groq's natural conversational text when NOT yet showing a report
      if (groqResult?.content && !allowReport) {
        finalContent = groqResult.content;
      }

      // Merge Groq risk scores only if dataset found nothing and report is allowed
      if (allowReport && !datasetResult.riskScores && groqResult?.riskScores) {
        datasetResult.riskScores = groqResult.riskScores;
        datasetResult.report     = groqResult.report;
      }
    } catch (groqErr) {
      console.warn("Groq unavailable, using dataset engine response:", groqErr);
    }

    return NextResponse.json({
      role:             "model",
      content:          finalContent,
      detectedLanguage: detectedLanguage,
      isSummary:        allowReport && !!datasetResult.riskScores,
      riskScores:       allowReport ? datasetResult.riskScores : null,
      report:           allowReport ? datasetResult.report : null,
    });

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({
      role:             "model",
      content:          "Please describe your symptoms and I'll help you right away.",
      detectedLanguage: "English",
      isSummary:        false,
      riskScores:       null,
      report:           null,
    });
  }
}
