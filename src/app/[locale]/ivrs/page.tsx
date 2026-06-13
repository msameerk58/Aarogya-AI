"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Battery, Delete, Mic, Phone, PhoneCall, PhoneOff, RotateCcw, Signal, Volume2, Wifi } from "lucide-react";

type CallState = "IDLE" | "MENU" | "QUESTIONS" | "SPEAK" | "ENDED";
type Language = "en-IN" | "mr-IN" | "hi-IN" | "ta-IN" | "te-IN" | "kn-IN" | "bn-IN";
type Answer = "yes" | "no";

type SpeechRecognitionConstructor = new () => SpeechRecognition;

interface SpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

const LANGUAGES: { digit: string; code: Language; name: string }[] = [
  { digit: "1", code: "en-IN", name: "English" },
  { digit: "2", code: "mr-IN", name: "Marathi" },
  { digit: "3", code: "hi-IN", name: "Hindi" },
  { digit: "4", code: "ta-IN", name: "Tamil" },
  { digit: "5", code: "te-IN", name: "Telugu" },
  { digit: "6", code: "kn-IN", name: "Kannada" },
  { digit: "7", code: "bn-IN", name: "Bengali" },
];

const QUESTIONS: { id: string; label: string; prompt: Record<Language, string> }[] = [
  {
    id: "cough",
    label: "Cough over 2 weeks",
    prompt: {
      "en-IN": "Do you have cough for more than two weeks? Press 1 for yes, 2 for no.",
      "mr-IN": "Tumhala don athavdyan peksha jast khokla aahe ka? Ho sathi 1, nahi sathi 2 daba.",
      "hi-IN": "Kya aapko do hafte se zyada khansi hai? Haan ke liye 1, nahi ke liye 2 dabayen.",
      "ta-IN": "Do weeks se zyada cough hai? Yes ke liye 1, no ke liye 2 press karein.",
      "te-IN": "Do weeks se zyada cough hai? Yes ke liye 1, no ke liye 2 press karein.",
      "kn-IN": "Do weeks se zyada cough hai? Yes ke liye 1, no ke liye 2 press karein.",
      "bn-IN": "Do weeks se zyada cough hai? Yes ke liye 1, no ke liye 2 press karein.",
    },
  },
  {
    id: "fever",
    label: "Fever",
    prompt: {
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
    label: "Night sweats",
    prompt: {
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
    label: "Weight loss",
    prompt: {
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
    label: "Breathing trouble",
    prompt: {
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
    label: "Blood in sputum",
    prompt: {
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

const languageMenu =
  "Welcome to Aarogya AI. Press 1 for English. Press 2 for Marathi. Press 3 for Hindi. Press 4 for Tamil. Press 5 for Telugu. Press 6 for Kannada. Press 7 for Bengali.";

const speakPrompt: Record<Language, string> = {
  "en-IN": "Now describe your symptoms in your own words after the beep.",
  "mr-IN": "Ata beep nantar tumchi lakshane tumchya bhashayt sanga.",
  "hi-IN": "Ab beep ke baad apne symptoms apni bhasha me batayen.",
  "ta-IN": "Beep ke baad apne symptoms apni language me boliye.",
  "te-IN": "Beep ke baad apne symptoms apni language me boliye.",
  "kn-IN": "Beep ke baad apne symptoms apni language me boliye.",
  "bn-IN": "Beep ke baad apne symptoms apni language me boliye.",
};

const smsTemplate: Record<Language, (risk: string, yesCount: number, symptoms: string) => string> = {
  "en-IN": (risk, yesCount, symptoms) =>
    `AAROGYA AI\nRisk: ${risk}\nPositive keypad symptoms: ${yesCount}/${QUESTIONS.length}\nSpoken symptoms: ${symptoms}\nNearest PHC: Ramnagar, 3.5 km\nABHA: AB-2847-XXXX\nVisit PHC today if symptoms continue.`,
  "mr-IN": (risk, yesCount, symptoms) =>
    `AAROGYA AI\nRisk: ${risk}\nKeypad lakshane: ${yesCount}/${QUESTIONS.length}\nBolun sangitleli lakshane: ${symptoms}\nNajikche PHC: Ramnagar, 3.5 km\nABHA: AB-2847-XXXX\nLakshane chalu astil tar aaj PHC la ja.`,
  "hi-IN": (risk, yesCount, symptoms) =>
    `AAROGYA AI\nRisk: ${risk}\nKeypad symptoms: ${yesCount}/${QUESTIONS.length}\nBole gaye symptoms: ${symptoms}\nNazdiki PHC: Ramnagar, 3.5 km\nABHA: AB-2847-XXXX\nSymptoms continue ho to aaj PHC jayein.`,
  "ta-IN": (risk, yesCount, symptoms) =>
    `AAROGYA AI\nRisk: ${risk}\nKeypad symptoms: ${yesCount}/${QUESTIONS.length}\nSpoken symptoms: ${symptoms}\nNearest PHC: Ramnagar, 3.5 km\nABHA: AB-2847-XXXX`,
  "te-IN": (risk, yesCount, symptoms) =>
    `AAROGYA AI\nRisk: ${risk}\nKeypad symptoms: ${yesCount}/${QUESTIONS.length}\nSpoken symptoms: ${symptoms}\nNearest PHC: Ramnagar, 3.5 km\nABHA: AB-2847-XXXX`,
  "kn-IN": (risk, yesCount, symptoms) =>
    `AAROGYA AI\nRisk: ${risk}\nKeypad symptoms: ${yesCount}/${QUESTIONS.length}\nSpoken symptoms: ${symptoms}\nNearest PHC: Ramnagar, 3.5 km\nABHA: AB-2847-XXXX`,
  "bn-IN": (risk, yesCount, symptoms) =>
    `AAROGYA AI\nRisk: ${risk}\nKeypad symptoms: ${yesCount}/${QUESTIONS.length}\nSpoken symptoms: ${symptoms}\nNearest PHC: Ramnagar, 3.5 km\nABHA: AB-2847-XXXX`,
};

function riskFromAnswers(answers: Record<string, Answer>, spokenSymptoms: string) {
  const yesCount = Object.values(answers).filter((answer) => answer === "yes").length;
  const speechBoost = /blood|breath|chest|fever|weight|khansi|khokla|rakt|saans|shwas/i.test(spokenSymptoms) ? 1 : 0;
  const score = yesCount + speechBoost;
  if (score >= 5) return "HIGH TB RISK";
  if (score >= 3) return "MODERATE TB RISK";
  return "LOW TB RISK";
}

function getRecognitionLanguage(code: Language) {
  return code === "en-IN" ? "en-US" : code;
}

export default function IVRSPage() {
  const [callState, setCallState] = useState<CallState>("IDLE");
  const [selectedLang, setSelectedLang] = useState<Language>("en-IN");
  const [languageName, setLanguageName] = useState("English");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [digits, setDigits] = useState("");
  const [transcript, setTranscript] = useState<{ from: "IVR" | "USER" | "SYSTEM"; text: string }[]>([]);
  const [spokenSymptoms, setSpokenSymptoms] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSource, setVoiceSource] = useState<"Sarvam" | "Browser">("Browser");
  const [currentTime, setCurrentTime] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  const yesCount = Object.values(answers).filter((answer) => answer === "yes").length;
  const risk = riskFromAnswers(answers, spokenSymptoms);
  const sms = useMemo(
    () => smsTemplate[selectedLang](risk, yesCount, spokenSymptoms || "Not captured"),
    [risk, selectedLang, spokenSymptoms, yesCount]
  );

  useEffect(() => {
    const tick = () => setCurrentTime(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  function addLine(from: "IVR" | "USER" | "SYSTEM", text: string) {
    setTranscript((prev) => [...prev, { from, text }]);
  }

  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }

  async function speak(text: string, lang: Language) {
    stopAudio();
    setIsSpeaking(true);
    try {
      const response = await fetch("/api/sarvam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, target_language_code: lang }),
      });
      const data = await response.json();
      if (data.audio) {
        setVoiceSource("Sarvam");
        const audio = new Audio(data.audio);
        audioRef.current = audio;
        audio.onended = () => setIsSpeaking(false);
        audio.onerror = () => browserSpeak(text, lang);
        await audio.play();
        return;
      }
    } catch {
      // Use browser voice if Sarvam is unavailable in local demo mode.
    }
    browserSpeak(text, lang);
  }

  function browserSpeak(text: string, lang: Language) {
    setVoiceSource("Browser");
    if (!("speechSynthesis" in window)) {
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.82;
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }

  function startCall() {
    stopAudio();
    setCallState("MENU");
    setQuestionIndex(0);
    setAnswers({});
    setDigits("");
    setSpokenSymptoms("");
    setTranscript([]);
    addLine("IVR", languageMenu);
    void speak(languageMenu, "en-IN");
  }

  function pressDigit(digit: string) {
    if (callState === "MENU") {
      const chosen = LANGUAGES.find((language) => language.digit === digit);
      if (!chosen) {
        addLine("SYSTEM", "Invalid option. Please choose a language from 1 to 7.");
        void speak("Invalid option. Please choose a language from 1 to 7.", "en-IN");
        return;
      }
      setDigits(digit);
      setSelectedLang(chosen.code);
      setLanguageName(chosen.name);
      setCallState("QUESTIONS");
      addLine("USER", `Pressed ${digit} for ${chosen.name}`);
      addLine("IVR", QUESTIONS[0].prompt[chosen.code]);
      void speak(QUESTIONS[0].prompt[chosen.code], chosen.code);
      return;
    }

    setDigits((prev) => `${prev}${digit}`);

    if (callState === "QUESTIONS") {
      if (digit !== "1" && digit !== "2") {
        addLine("SYSTEM", "Please press 1 for yes or 2 for no.");
        void speak("Please press 1 for yes or 2 for no.", selectedLang);
        return;
      }
      const answer: Answer = digit === "1" ? "yes" : "no";
      const question = QUESTIONS[questionIndex];
      const nextAnswers = { ...answers, [question.id]: answer };
      setAnswers(nextAnswers);
      addLine("USER", `Pressed ${digit}: ${answer === "yes" ? "Yes" : "No"}`);

      const nextIndex = questionIndex + 1;
      if (nextIndex >= QUESTIONS.length) {
        setCallState("SPEAK");
        setQuestionIndex(nextIndex);
        addLine("IVR", speakPrompt[selectedLang]);
        void speak(speakPrompt[selectedLang], selectedLang);
        return;
      }

      setQuestionIndex(nextIndex);
      addLine("IVR", QUESTIONS[nextIndex].prompt[selectedLang]);
      void speak(QUESTIONS[nextIndex].prompt[selectedLang], selectedLang);
    }
  }

  function backspaceDigit() {
    setDigits((prev) => prev.slice(0, -1));
  }

  function listenForSymptoms() {
    const Recognition =
      (window as typeof window & { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor })
        .SpeechRecognition ||
      (window as typeof window & { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor })
        .webkitSpeechRecognition;

    if (!Recognition) {
      addLine("SYSTEM", "Speech input is not available in this browser. Type a short symptom note instead.");
      return;
    }

    stopAudio();
    const recognition = new Recognition();
    recognition.lang = getRecognitionLanguage(selectedLang);
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const text = event.results[0]?.[0]?.transcript ?? "";
      setSpokenSymptoms(text);
      addLine("USER", text || "No speech captured");
      finishCall(text);
    };
    recognition.onerror = () => {
      setIsListening(false);
      addLine("SYSTEM", "Could not hear clearly. Please try again.");
    };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
  }

  function finishCall(symptoms = spokenSymptoms) {
    recognitionRef.current?.abort();
    setIsListening(false);
    setSpokenSymptoms(symptoms);
    setCallState("ENDED");
    const closing =
      selectedLang === "mr-IN"
        ? "Screening purna zali. Tumhala SMS tumchya bhashayt milala aahe."
        : selectedLang === "hi-IN"
          ? "Screening poori hui. Aapko SMS aapki bhasha me mil gaya hai."
          : "Screening complete. You have received the SMS in your selected language.";
    addLine("IVR", closing);
    void speak(closing, selectedLang);
  }

  function reset() {
    recognitionRef.current?.abort();
    stopAudio();
    setCallState("IDLE");
    setSelectedLang("en-IN");
    setLanguageName("English");
    setQuestionIndex(0);
    setAnswers({});
    setDigits("");
    setTranscript([]);
    setSpokenSymptoms("");
    setIsListening(false);
  }

  return (
    <main className="min-h-screen bg-[#101820] px-4 py-6 text-white">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[380px_1fr]">
        <section className="overflow-hidden rounded-[32px] border-[10px] border-slate-800 bg-black shadow-2xl">
          <div className="flex items-center justify-between px-6 py-4 text-xs text-slate-200">
            <span>{currentTime}</span>
            <div className="flex items-center gap-1.5">
              <Signal className="h-3.5 w-3.5" />
              <Wifi className="h-3.5 w-3.5" />
              <Battery className="h-4 w-4" />
            </div>
          </div>

          <div className="min-h-[700px] bg-slate-950">
            <div className="border-b border-white/10 bg-slate-900 px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Aarogya AI IVRS</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {callState === "IDLE" ? "Ready" : `${languageName} · ${voiceSource} voice`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {isSpeaking && <Volume2 className="h-5 w-5 text-emerald-300" />}
                  {isListening && <Mic className="h-5 w-5 text-red-300" />}
                </div>
              </div>
            </div>

            {callState === "IDLE" ? (
              <div className="flex min-h-[620px] flex-col items-center justify-center px-6 text-center">
                <div className="mb-7 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500">
                  <PhoneCall className="h-10 w-10" />
                </div>
                <h1 className="text-3xl font-semibold">IVRS call demo</h1>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Starts exactly like a phone call: press 1 for English, press 2 for Marathi, and continue by keypad.
                </p>
                <button
                  onClick={startCall}
                  className="mt-10 flex w-full items-center justify-center gap-3 rounded-md bg-emerald-500 px-5 py-4 font-semibold text-white hover:bg-emerald-400"
                >
                  <Phone className="h-5 w-5" />
                  Start call
                </button>
              </div>
            ) : callState === "ENDED" ? (
              <div className="flex min-h-[620px] flex-col gap-4 p-5">
                <div className="rounded-md border border-emerald-500/25 bg-emerald-500/10 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-300">Final result</p>
                  <p className="mt-1 text-2xl font-bold text-emerald-300">{risk}</p>
                  <p className="mt-2 text-sm text-slate-200">
                    {yesCount} of {QUESTIONS.length} keypad answers were yes.
                  </p>
                </div>

                <div className="rounded-md border border-white/10 bg-slate-800 p-4">
                  <p className="mb-3 text-sm font-bold">SMS received by user</p>
                  <p className="whitespace-pre-wrap text-sm leading-6 text-slate-100">{sms}</p>
                </div>

                <button
                  onClick={reset}
                  className="mt-auto flex items-center justify-center gap-2 rounded-md bg-white/10 px-4 py-3 font-semibold hover:bg-white/15"
                >
                  <RotateCcw className="h-4 w-4" />
                  Test again
                </button>
              </div>
            ) : (
              <div className="flex min-h-[620px] flex-col">
                <div className="flex-1 space-y-3 overflow-y-auto p-4">
                  {transcript.map((line, index) => (
                    <div key={`${line.from}-${index}`} className={`flex ${line.from === "USER" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[86%] rounded-lg px-3 py-2 text-sm leading-6 ${
                          line.from === "USER"
                            ? "bg-emerald-500 text-white"
                            : line.from === "SYSTEM"
                              ? "bg-amber-500/15 text-amber-100"
                              : "bg-slate-800 text-slate-100"
                        }`}
                      >
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider opacity-70">{line.from}</p>
                        {line.text}
                      </div>
                    </div>
                  ))}
                  <div ref={transcriptEndRef} />
                </div>

                {callState === "SPEAK" && (
                  <div className="border-t border-white/10 bg-slate-900 p-4">
                    <button
                      onClick={listenForSymptoms}
                      className={`mb-3 flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 font-semibold ${
                        isListening ? "bg-red-500" : "bg-sky-500 hover:bg-sky-400"
                      }`}
                    >
                      <Mic className="h-5 w-5" />
                      {isListening ? "Listening..." : "Speak symptoms"}
                    </button>
                    <textarea
                      value={spokenSymptoms}
                      onChange={(event) => setSpokenSymptoms(event.target.value)}
                      placeholder="Or type what the user said..."
                      className="h-20 w-full resize-none rounded-md border border-white/10 bg-slate-950 p-3 text-sm text-white outline-none"
                    />
                    <button
                      onClick={() => finishCall()}
                      className="mt-3 w-full rounded-md bg-emerald-500 px-4 py-3 font-semibold text-white hover:bg-emerald-400"
                    >
                      Generate SMS
                    </button>
                  </div>
                )}

                {callState !== "SPEAK" && (
                  <div className="border-t border-white/10 bg-slate-900 p-4">
                    <div className="mb-3 rounded-md bg-slate-950 px-4 py-3 text-right font-mono text-xl">{digits || " "}</div>
                    <div className="grid grid-cols-3 gap-2">
                      {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((digit) => (
                        <button
                          key={digit}
                          onClick={() => pressDigit(digit)}
                          className="rounded-md bg-slate-700 py-4 text-xl font-semibold hover:bg-slate-600"
                        >
                          {digit}
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button onClick={backspaceDigit} className="flex flex-1 items-center justify-center gap-2 rounded-md bg-white/10 py-3 hover:bg-white/15">
                        <Delete className="h-4 w-4" />
                        Delete
                      </button>
                      <button onClick={reset} className="flex flex-1 items-center justify-center gap-2 rounded-md bg-red-500 py-3 hover:bg-red-400">
                        <PhoneOff className="h-4 w-4" />
                        End
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="grid content-start gap-5">
          <div className="rounded-md border border-white/10 bg-[#17212b] p-6">
            <h2 className="text-2xl font-semibold">Required call flow</h2>
            <div className="mt-5 grid gap-3">
              {[
                "1. IVRS asks: press 1 for English, press 2 for Marathi, and so on.",
                "2. User selects language using phone keypad.",
                "3. IVRS asks screening questions. User answers with keypad: 1 yes, 2 no.",
                "4. IVRS asks user to speak symptoms freely in the selected language.",
                "5. User receives SMS preview in the selected language.",
              ].map((line) => (
                <div key={line} className="rounded-md bg-white/5 p-4 text-sm leading-6 text-slate-200">
                  {line}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-white/10 bg-[#17212b] p-6">
            <h2 className="text-2xl font-semibold">Live answer summary</h2>
            <div className="mt-4 grid gap-2">
              {QUESTIONS.map((question) => (
                <div key={question.id} className="flex justify-between rounded-md bg-white/5 px-3 py-2 text-sm">
                  <span className="text-slate-300">{question.label}</span>
                  <span className="font-semibold">{answers[question.id] ?? "pending"}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
