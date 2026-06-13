import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function generateChatResponse(messages: { role: string; content: string }[], language: string) {
  const systemPrompt = `You are Aarogya AI, a compassionate health assistant for rural India. 
Respond to the user in the language they used. If they haven't spoken yet, use ${language}.
Ask one symptom question at a time. Keep it brief. 
Be culturally sensitive. Never diagnose definitively, but guide them to the nearest PHC if risk is high.

=== KNOWLEDGE BASE (Use this to answer user questions about schemes/protocols) ===
1. PM-JAY (Ayushman Bharat): Free health insurance scheme providing up to ₹5 lakhs per family per year for secondary and tertiary care.
2. JSY (Janani Suraksha Yojana): Provides cash assistance to pregnant women for institutional delivery to reduce maternal mortality.
3. TB Protocol: If cough persists for >2 weeks, immediate sputum test at the nearest PHC is required. Free treatment under NTEP.
4. Malaria/Dengue Protocol: Fever >3 days with chills/joint pain requires immediate blood smear test.`;

  const chatHistory = messages.slice(0, -1).filter(m => m.role !== 'system');
  const lastUserMessage = messages[messages.length - 1];

  const formattedMessages = [
    { role: "system" as const, content: systemPrompt },
    ...chatHistory.map(m => ({ role: m.role === "user" ? "user" as const : "assistant" as const, content: m.content })),
    { role: "user" as const, content: lastUserMessage?.content || "Hello" }
  ];

  const response = await openai.chat.completions.create(
    {
      model: "gpt-4o-mini",
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 1024,
      response_format: {
      type: "json_schema",
      json_schema: {
        name: "health_response",
        strict: true,
        schema: {
          type: "object",
          properties: {
            content: {
              type: "string",
              description: "Your conversational response or answer to the user."
            },
            detectedLanguage: {
              type: "string",
              description: "The language you are responding in."
            },
            riskScores: {
              type: ["array", "null"],
              description: "If you have enough symptoms to assess risk (usually after 3-4 questions), provide the risk scores. Otherwise, return null.",
              items: {
                type: "object",
                properties: {
                  disease: { type: "string" },
                  probability: { type: "number" },
                  level: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
                  reasons: { type: "array", items: { type: "string" } }
                },
                required: ["disease", "probability", "level", "reasons"],
                additionalProperties: false
              }
            }
          },
          required: ["content", "detectedLanguage", "riskScores"],
          additionalProperties: false
        }
      }
    }
    },
    { timeout: 30000 }
  );

  const text = response.choices[0].message.content;
  if (!text) throw new Error("Empty response from OpenAI");

  return JSON.parse(text);
}
