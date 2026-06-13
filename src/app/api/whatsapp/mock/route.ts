import { NextResponse } from "next/server";
import { analyzeSymptoms } from "@/lib/dataset-engine";
import { generateChatResponse } from "@/lib/groq";

// Per-session chat history for the WhatsApp simulator
const sessions = new Map<string, { history: { role: string; content: string }[]; lang: string }>();

function detectLanguage(text: string): string {
  if (/[\u0C80-\u0CFF]/.test(text)) return "Kannada";
  if (/[\u0B80-\u0BFF]/.test(text)) return "Tamil";
  if (/[\u0C00-\u0C7F]/.test(text)) return "Telugu";
  if (/[\u0D00-\u0D7F]/.test(text)) return "Malayalam";
  if (/[\u0A00-\u0A7F]/.test(text)) return "Punjabi";
  if (/[\u0A80-\u0AFF]/.test(text)) return "Gujarati";
  if (/[\u0980-\u09FF]/.test(text)) return "Bengali";
  if (/[\u0900-\u097F]/.test(text)) return "Hindi";
  return "English";
}

export async function POST(req: Request) {
  try {
    const { Body, From } = await req.json();
    const sessionKey = From || "demo";

    if (!sessions.has(sessionKey)) {
      sessions.set(sessionKey, { history: [], lang: "English" });
    }
    const session = sessions.get(sessionKey)!;

    const lang = detectLanguage(Body);
    session.lang = lang;
    session.history.push({ role: "user", content: Body });

    const datasetResponse = analyzeSymptoms(session.history, lang);

    let aiResponse = datasetResponse;
    try {
      const groqResponse = await generateChatResponse(session.history, lang);
      if (groqResponse?.content) {
        aiResponse = {
          ...datasetResponse,
          content:          groqResponse.content,
          detectedLanguage: groqResponse.detectedLanguage || lang,
          riskScores:       datasetResponse.riskScores || groqResponse.riskScores,
          report:           datasetResponse.report     || groqResponse.report,
        };
      }
    } catch {
      // Groq failed — use dataset response
    }

    session.history.push({ role: "model", content: aiResponse.content });
    if (session.history.length > 10) session.history = session.history.slice(-10);

    let response = aiResponse.content;

    if (aiResponse.riskScores && aiResponse.riskScores.length > 0) {
      const top = aiResponse.riskScores[0];
      response += `\n\n⚠️ *RISK ALERT*\n*${top.disease}*: ${top.probability}% ${top.level}\n\n📞 Call *104* for free health advice\n🚑 Call *108* for ambulance\n\nReply *ABHA* to get your Health ID or *PHC* to book a clinic visit.`;
    }

    const bodyLower = Body.toLowerCase();
    if (bodyLower.includes("abha") || bodyLower.includes("ayushman") || bodyLower.includes("bharat") || bodyLower.includes("health id")) {
      response = `🆔 *Your ABHA Health ID*\n91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}\n\nThis is your Ayushman Bharat Digital Health ID. Visit your nearest PHC with this number.`;
      sessions.delete(sessionKey);
    }

    if (bodyLower.includes("phc") || bodyLower.includes("clinic")) {
      response = `🏥 *Nearest PHC Booked*\n\nPrimary Health Centre\nBangalore Rural District\n📍 Visit with your Aadhaar card\n⏰ Timing: 9AM - 5PM (Mon-Sat)\n\n✅ Appointment confirmed. An alert has been sent to the PHC.`;
      sessions.delete(sessionKey);
    }

    if (bodyLower === "reset" || bodyLower === "start") {
      sessions.delete(sessionKey);
      response = "नमस्ते! / Hello! I am Aarogya AI. Please describe your symptoms and I will analyze them based on official ICMR health guidelines.";
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error("WhatsApp mock error:", error);
    return NextResponse.json({ response: "Please describe your symptoms and I'll help you right away." });
  }
}
