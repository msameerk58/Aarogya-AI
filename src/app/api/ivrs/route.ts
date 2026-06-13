import { NextRequest, NextResponse } from "next/server";

type Language = "en-IN" | "mr-IN" | "hi-IN" | "ta-IN" | "te-IN" | "kn-IN" | "bn-IN";

interface Question {
  id: string;
  text: Record<Language, string>;
}

const LANGUAGES: Record<string, { code: Language; name: string }> = {
  "1": { code: "en-IN", name: "English" },
  "2": { code: "mr-IN", name: "Marathi" },
  "3": { code: "hi-IN", name: "Hindi" },
  "4": { code: "ta-IN", name: "Tamil" },
  "5": { code: "te-IN", name: "Telugu" },
  "6": { code: "kn-IN", name: "Kannada" },
  "7": { code: "bn-IN", name: "Bengali" },
};

const QUESTIONS: Question[] = [
  {
    id: "cough",
    text: {
      "en-IN": "Do you have cough for more than two weeks? Press 1 for yes, 2 for no.",
      "mr-IN": "Tumhala don athavdyan peksha jast khokla aahe ka? Ho sathi 1, nahi sathi 2 daba.",
      "hi-IN": "Kya aapko do hafte se zyada khansi hai? Haan ke liye 1, nahi ke liye 2 dabayen.",
      "ta-IN": "Two weeks se zyada cough hai? Yes ke liye 1, no ke liye 2 press karein.",
      "te-IN": "Two weeks se zyada cough hai? Yes ke liye 1, no ke liye 2 press karein.",
      "kn-IN": "Two weeks se zyada cough hai? Yes ke liye 1, no ke liye 2 press karein.",
      "bn-IN": "Two weeks se zyada cough hai? Yes ke liye 1, no ke liye 2 press karein.",
    },
  },
  {
    id: "fever",
    text: {
      "en-IN": "Have you had fever recently? Press 1 for yes, 2 for no.",
      "mr-IN": "Tumhala alikade taap ala hota ka? Ho sathi 1, nahi sathi 2 daba.",
      "hi-IN": "Kya aapko bukhar hai? Haan ke liye 1, nahi ke liye 2 dabayen.",
      "ta-IN": "Fever hai? Yes ke liye 1, no ke liye 2 press karein.",
      "te-IN": "Fever hai? Yes ke liye 1, no ke liye 2 press karein.",
      "kn-IN": "Fever hai? Yes ke liye 1, no ke liye 2 press karein.",
      "bn-IN": "Fever hai? Yes ke liye 1, no ke liye 2 press karein.",
    },
  },
  {
    id: "nightSweats",
    text: {
      "en-IN": "Do you get night sweats? Press 1 for yes, 2 for no.",
      "mr-IN": "Tumhala ratri gham yeto ka? Ho sathi 1, nahi sathi 2 daba.",
      "hi-IN": "Kya raat me pasina aata hai? Haan ke liye 1, nahi ke liye 2 dabayen.",
      "ta-IN": "Night sweats aate hain? Yes ke liye 1, no ke liye 2 press karein.",
      "te-IN": "Night sweats aate hain? Yes ke liye 1, no ke liye 2 press karein.",
      "kn-IN": "Night sweats aate hain? Yes ke liye 1, no ke liye 2 press karein.",
      "bn-IN": "Night sweats aate hain? Yes ke liye 1, no ke liye 2 press karein.",
    },
  },
  {
    id: "weightLoss",
    text: {
      "en-IN": "Have you lost weight without trying? Press 1 for yes, 2 for no.",
      "mr-IN": "Tumche wajan karanashivay kami zhale aahe ka? Ho sathi 1, nahi sathi 2 daba.",
      "hi-IN": "Kya aapka wajan bina wajah kam hua hai? Haan ke liye 1, nahi ke liye 2 dabayen.",
      "ta-IN": "Weight bina reason kam hua hai? Yes ke liye 1, no ke liye 2 press karein.",
      "te-IN": "Weight bina reason kam hua hai? Yes ke liye 1, no ke liye 2 press karein.",
      "kn-IN": "Weight bina reason kam hua hai? Yes ke liye 1, no ke liye 2 press karein.",
      "bn-IN": "Weight bina reason kam hua hai? Yes ke liye 1, no ke liye 2 press karein.",
    },
  },
  {
    id: "breathing",
    text: {
      "en-IN": "Do you have trouble breathing? Press 1 for yes, 2 for no.",
      "mr-IN": "Tumhala shwas ghenyas tras hoto ka? Ho sathi 1, nahi sathi 2 daba.",
      "hi-IN": "Kya saans lene me dikkat hoti hai? Haan ke liye 1, nahi ke liye 2 dabayen.",
      "ta-IN": "Breathing me difficulty hai? Yes ke liye 1, no ke liye 2 press karein.",
      "te-IN": "Breathing me difficulty hai? Yes ke liye 1, no ke liye 2 press karein.",
      "kn-IN": "Breathing me difficulty hai? Yes ke liye 1, no ke liye 2 press karein.",
      "bn-IN": "Breathing me difficulty hai? Yes ke liye 1, no ke liye 2 press karein.",
    },
  },
  {
    id: "blood",
    text: {
      "en-IN": "Have you coughed blood or blood stained sputum? Press 1 for yes, 2 for no.",
      "mr-IN": "Khoklyat rakt ale aahe ka? Ho sathi 1, nahi sathi 2 daba.",
      "hi-IN": "Kya khansi ke sath khoon aaya hai? Haan ke liye 1, nahi ke liye 2 dabayen.",
      "ta-IN": "Cough ke sath blood aaya hai? Yes ke liye 1, no ke liye 2 press karein.",
      "te-IN": "Cough ke sath blood aaya hai? Yes ke liye 1, no ke liye 2 press karein.",
      "kn-IN": "Cough ke sath blood aaya hai? Yes ke liye 1, no ke liye 2 press karein.",
      "bn-IN": "Cough ke sath blood aaya hai? Yes ke liye 1, no ke liye 2 press karein.",
    },
  },
];

export async function POST(req: NextRequest) {
  const baseUrl = process.env.BASE_URL?.replace(/\/$/, "") || `${req.nextUrl.protocol}//${req.nextUrl.host}`;
  const params = req.nextUrl.searchParams;
  const step = params.get("step") ?? "menu";
  const lang = ((params.get("lang") as Language | null) ?? "en-IN") as Language;
  const q = Number(params.get("q") ?? "0");
  const yes = Number(params.get("yes") ?? "0");

  const formData = await req.formData();
  const digits = String(formData.get("Digits") ?? "");
  const speech = String(formData.get("SpeechResult") ?? "");

  const body = buildFlow({ baseUrl, step, lang, q, yes, digits, speech });

  return new NextResponse(body, {
    headers: { "Content-Type": "text/xml; charset=utf-8" },
  });
}

function buildFlow({
  baseUrl,
  step,
  lang,
  q,
  yes,
  digits,
  speech,
}: {
  baseUrl: string;
  step: string;
  lang: Language;
  q: number;
  yes: number;
  digits: string;
  speech: string;
}) {
  if (step === "menu") {
    if (!digits) return languageMenu(baseUrl);
    const selected = LANGUAGES[digits];
    if (!selected) {
      return xml(sayOrPlay("Invalid option. Please choose from 1 to 7.", "en-IN", baseUrl) + redirect(`${baseUrl}/api/ivrs?step=menu`));
    }
    return askQuestion(baseUrl, selected.code, 0, 0);
  }

  if (step === "question") {
    if (digits !== "1" && digits !== "2") {
      return xml(
        sayOrPlay("You have not selected anything. Please press 1 for yes or 2 for no.", lang, baseUrl) +
          askQuestionBody(baseUrl, lang, q, yes)
      );
    }

    const nextYes = yes + (digits === "1" ? 1 : 0);
    const nextQ = q + 1;

    if (nextQ >= QUESTIONS.length) {
      return freeSpeechPrompt(baseUrl, lang, nextYes);
    }

    return askQuestion(baseUrl, lang, nextQ, nextYes);
  }

  if (step === "speech") {
    if (!speech.trim()) {
      const prompt =
        lang === "mr-IN"
          ? "Tumhi kahi bolle nahi. Krupaya beep nantar tumchi lakshane sanga."
          : lang === "hi-IN"
            ? "Aapne kuch nahi bola. Kripya beep ke baad apne symptoms batayen."
            : "You did not say anything. Please describe your symptoms after the beep.";
      return xml(sayOrPlay(prompt, lang, baseUrl) + freeSpeechGather(baseUrl, lang, yes));
    }

    return finalSms(baseUrl, lang, yes, speech);
  }

  return xml(redirect(`${baseUrl}/api/ivrs?step=menu`));
}

function languageMenu(baseUrl: string) {
  const text =
    "Welcome to Aarogya AI. Press 1 for English. Press 2 for Marathi. Press 3 for Hindi. Press 4 for Tamil. Press 5 for Telugu. Press 6 for Kannada. Press 7 for Bengali.";

  return xml(
    gather(`${baseUrl}/api/ivrs?step=menu`, sayOrPlay(text, "en-IN", baseUrl), {
      input: "dtmf",
      numDigits: 1,
      timeout: 8,
    }) +
      sayOrPlay("You have not selected anything. Returning to language menu.", "en-IN", baseUrl) +
      redirect(`${baseUrl}/api/ivrs?step=menu`)
  );
}

function askQuestion(baseUrl: string, lang: Language, q: number, yes: number) {
  return xml(askQuestionBody(baseUrl, lang, q, yes));
}

function askQuestionBody(baseUrl: string, lang: Language, q: number, yes: number) {
  return gather(`${baseUrl}/api/ivrs?step=question&lang=${lang}&q=${q}&yes=${yes}`, sayOrPlay(QUESTIONS[q].text[lang], lang, baseUrl), {
    input: "dtmf",
    numDigits: 1,
    timeout: 8,
  });
}

function freeSpeechPrompt(baseUrl: string, lang: Language, yes: number) {
  const text =
    lang === "mr-IN"
      ? "Ata beep nantar tumchi lakshane tumchya bhashayt sanga."
      : lang === "hi-IN"
        ? "Ab beep ke baad apne symptoms apni bhasha me batayen."
        : "Now describe your symptoms in your own language after the beep.";

  return xml(sayOrPlay(text, lang, baseUrl) + freeSpeechGather(baseUrl, lang, yes));
}

function freeSpeechGather(baseUrl: string, lang: Language, yes: number) {
  return gather(`${baseUrl}/api/ivrs?step=speech&lang=${lang}&yes=${yes}`, "<Pause length=\"1\"/>", {
    input: "speech",
    timeout: 6,
    speechTimeout: "auto",
    language: lang,
  });
}

function finalSms(baseUrl: string, lang: Language, yes: number, speech: string) {
  const risk = riskLabel(yes, speech);
  const sms = smsText(lang, risk, yes, speech);
  const closing =
    lang === "mr-IN"
      ? `Screening purna zali. SMS asa aahe. ${sms}`
      : lang === "hi-IN"
        ? `Screening poori hui. SMS yeh hai. ${sms}`
        : `Screening complete. The user receives this SMS. ${sms}`;

  return xml(sayOrPlay(closing, lang, baseUrl) + "<Hangup/>");
}

function riskLabel(yes: number, speech: string) {
  const speechBoost = /blood|breath|chest|fever|weight|cough|khansi|khokla|rakt|saans|shwas/i.test(speech) ? 1 : 0;
  const score = yes + speechBoost;
  if (score >= 5) return "HIGH TB RISK";
  if (score >= 3) return "MODERATE TB RISK";
  return "LOW TB RISK";
}

function smsText(lang: Language, risk: string, yes: number, speech: string) {
  if (lang === "mr-IN") {
    return `Aarogya AI. Risk ${risk}. Keypad lakshane ${yes}/${QUESTIONS.length}. Bolun sangitleli lakshane: ${speech}. Najikche PHC Ramnagar, 3.5 kilometer. ABHA A B 2847.`;
  }
  if (lang === "hi-IN") {
    return `Aarogya AI. Risk ${risk}. Keypad symptoms ${yes}/${QUESTIONS.length}. Bole gaye symptoms: ${speech}. Nazdiki PHC Ramnagar, 3.5 kilometer. ABHA A B 2847.`;
  }
  return `Aarogya AI. Risk ${risk}. Keypad symptoms ${yes}/${QUESTIONS.length}. Spoken symptoms: ${speech}. Nearest PHC Ramnagar, 3.5 kilometers. ABHA A B 2847.`;
}

function gather(
  action: string,
  children: string,
  options: { input: string; timeout: number; numDigits?: number; speechTimeout?: string; language?: Language }
) {
  const numDigits = options.numDigits ? ` numDigits="${options.numDigits}"` : "";
  const speechTimeout = options.speechTimeout ? ` speechTimeout="${options.speechTimeout}"` : "";
  const language = options.language ? ` language="${options.language}"` : "";
  return `<Gather input="${options.input}" action="${escapeXml(action)}" method="POST" timeout="${options.timeout}" actionOnEmptyResult="true"${numDigits}${speechTimeout}${language}>${children}</Gather>`;
}

function sayOrPlay(text: string, lang: Language, baseUrl: string) {
  if (process.env.SARVAM_API_KEY && process.env.SARVAM_API_KEY !== "your_sarvam_key_here") {
    const url = `${baseUrl}/api/ivrs/tts?lang=${encodeURIComponent(lang)}&text=${encodeURIComponent(text)}`;
    return `<Play>${escapeXml(url)}</Play>`;
  }
  return `<Say language="${lang}">${escapeXml(text)}</Say>`;
}

function redirect(url: string) {
  return `<Redirect method="POST">${escapeXml(url)}</Redirect>`;
}

function xml(body: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<Response>${body}</Response>`;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
