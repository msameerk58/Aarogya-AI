"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Send,
  HeartPulse,
  UserCircle,
  MapPin,
  Activity,
  CheckCircle2,
  Volume2,
  VolumeX,
  AlertCircle,
  Sparkles,
  BrainCircuit,
  ShieldCheck,
  Stethoscope,
  Phone,
  FlaskConical,
  Pill,
  BookOpen,
  XCircle,
  BadgeCheck,
} from "lucide-react";
import confetti from "canvas-confetti";
import { GREETINGS, normalizeLanguage } from "@/lib/dataset-engine";

type LanguageName = "English" | "Hindi" | "Marathi" | "Tamil" | "Telugu" | "Kannada" | "Bengali";

type Message = {
  role: "user" | "model" | "system";
  content: string;
};

type RiskScore = {
  disease: string;
  probability: number;
  level: "HIGH" | "MEDIUM" | "LOW";
  reasons: string[];
};

type ClinicalReport = {
  summary: string;
  immediateActions: string[];
  requiredTests: { test: string; reason: string; cost: string }[];
  prescriptionGuidance: { medication: string; dosage: string; notes: string }[];
  governmentSchemes: { scheme: string; benefit: string; contact: string }[];
  phcContact: { instructions: string; nationalHelpline: string; emergencyNumber: string };
  doNotDo: string[];
};

type SpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

interface BrowserSpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: any) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}

interface BrowserSpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

const LOCALE_TO_LANGUAGE: Record<string, LanguageName> = {
  "en-IN": "English",
  "hi-IN": "Hindi",
  "mr-IN": "Marathi",
  "ta-IN": "Tamil",
  "te-IN": "Telugu",
  "kn-IN": "Kannada",
  "bn-IN": "Bengali",
};

const LANGUAGE_OPTIONS: { value: LanguageName; label: string }[] = [
  { value: "English", label: "English" },
  { value: "Hindi", label: "हिंदी" },
  { value: "Marathi", label: "मराठी" },
  { value: "Tamil", label: "தமிழ்" },
  { value: "Telugu", label: "తెలుగు" },
  { value: "Kannada", label: "ಕನ್ನಡ" },
  { value: "Bengali", label: "বাংলা" },
];

const SPEECH_INPUT_CODES: Record<LanguageName, string> = {
  English: "en-US",
  Hindi: "hi-IN",
  Marathi: "mr-IN",
  Tamil: "ta-IN",
  Telugu: "te-IN",
  Kannada: "kn-IN",
  Bengali: "bn-IN",
};

const SPEECH_OUTPUT_CODES: Record<LanguageName, string> = {
  English: "en-IN",
  Hindi: "hi-IN",
  Marathi: "mr-IN",
  Tamil: "ta-IN",
  Telugu: "te-IN",
  Kannada: "kn-IN",
  Bengali: "bn-IN",
};

const UI_COPY: Record<
  LanguageName,
  {
    liveConnection: string;
    speaking: string;
    placeholder: string;
    listening: string;
    send: string;
    waitingTitle: string;
    waitingBody: string;
    dashboard: string;
    poweredBy: string;
    tabs: { risk: string; tests: string; rx: string; schemes: string; phc: string };
    summary: string;
    immediateActions: string;
    doNotDo: string;
    testsTitle: string;
    testsEmpty: string;
    rxWarning: string;
    rxEmpty: string;
    schemesTitle: string;
    schemesEmpty: string;
    healthHelpline: string;
    emergency: string;
    generateAbha: string;
    sendPhcAlert: string;
    phcNotified: string;
  }
> = {
  English: {
    liveConnection: "Live Connection",
    speaking: "Voice Assistant Speaking...",
    placeholder: "Type your symptoms here in any language...",
    listening: "Listening to your symptoms...",
    send: "Send",
    waitingTitle: "Awaiting Symptoms",
    waitingBody: "Describe your symptoms in the chat. Aarogya AI will prepare risk, tests, and PHC guidance here.",
    dashboard: "Clinical Dashboard",
    poweredBy: "Powered by ICMR & Government of India protocols",
    tabs: { risk: "Risk", tests: "Tests", rx: "Rx / Meds", schemes: "Schemes", phc: "PHC Alert" },
    summary: "Summary",
    immediateActions: "Immediate Actions",
    doNotDo: "Do NOT Do",
    testsTitle: "Required Diagnostic Tests",
    testsEmpty: "Add a few more symptoms to generate test guidance.",
    rxWarning: "This guidance is informational only. A licensed doctor at the PHC must prescribe medication.",
    rxEmpty: "Add a few more symptoms to generate medication guidance.",
    schemesTitle: "Applicable Government Schemes",
    schemesEmpty: "Scheme information will appear here after risk assessment.",
    healthHelpline: "Health Helpline",
    emergency: "Emergency",
    generateAbha: "Generate ABHA Health ID",
    sendPhcAlert: "Send Alert to Nearest PHC",
    phcNotified: "PHC notified via WhatsApp",
  },
  Hindi: {
    liveConnection: "लाइव कनेक्शन",
    speaking: "आवाज सहायक बोल रहा है...",
    placeholder: "अपने लक्षण किसी भी भाषा में लिखें...",
    listening: "आपकी आवाज सुनी जा रही है...",
    send: "भेजें",
    waitingTitle: "लक्षणों की प्रतीक्षा",
    waitingBody: "चैट में अपने लक्षण लिखें। यहां जोखिम, जांच और PHC मार्गदर्शन दिखाई देगा।",
    dashboard: "क्लिनिकल डैशबोर्ड",
    poweredBy: "ICMR और भारत सरकार प्रोटोकॉल पर आधारित",
    tabs: { risk: "जोखिम", tests: "जांच", rx: "दवा", schemes: "योजना", phc: "PHC अलर्ट" },
    summary: "सारांश",
    immediateActions: "तुरंत करने वाले कदम",
    doNotDo: "यह न करें",
    testsTitle: "जरूरी जांच",
    testsEmpty: "जांच सुझाव पाने के लिए कुछ और लक्षण जोड़ें।",
    rxWarning: "यह केवल जानकारी है। दवा की पर्ची PHC के डॉक्टर से लें।",
    rxEmpty: "दवा मार्गदर्शन पाने के लिए कुछ और लक्षण जोड़ें।",
    schemesTitle: "लागू सरकारी योजनाएं",
    schemesEmpty: "जोखिम मूल्यांकन के बाद योजना जानकारी यहां आएगी।",
    healthHelpline: "हेल्थ हेल्पलाइन",
    emergency: "आपातकाल",
    generateAbha: "ABHA हेल्थ ID बनाएं",
    sendPhcAlert: "नजदीकी PHC को अलर्ट भेजें",
    phcNotified: "PHC को WhatsApp से सूचना भेज दी गई",
  },
  Marathi: {
    liveConnection: "लाईव्ह कनेक्शन",
    speaking: "आवाज सहाय्यक बोलत आहे...",
    placeholder: "तुमची लक्षणे कोणत्याही भाषेत लिहा...",
    listening: "तुमची लक्षणे ऐकली जात आहेत...",
    send: "पाठवा",
    waitingTitle: "लक्षणांची प्रतीक्षा",
    waitingBody: "चॅटमध्ये तुमची लक्षणे लिहा. इथे धोका, तपासण्या आणि PHC मार्गदर्शन दिसेल.",
    dashboard: "क्लिनिकल डॅशबोर्ड",
    poweredBy: "ICMR आणि भारत सरकार प्रोटोकॉलवर आधारित",
    tabs: { risk: "धोका", tests: "तपासण्या", rx: "औषध", schemes: "योजना", phc: "PHC अलर्ट" },
    summary: "सारांश",
    immediateActions: "तातडीची पावले",
    doNotDo: "हे करू नका",
    testsTitle: "आवश्यक तपासण्या",
    testsEmpty: "तपासणी मार्गदर्शनासाठी अजून थोडी लक्षणे द्या.",
    rxWarning: "ही माहितीपुरती आहे. औषध PHC डॉक्टरांनीच द्यावे.",
    rxEmpty: "औषध मार्गदर्शनासाठी अजून काही लक्षणे द्या.",
    schemesTitle: "लागू सरकारी योजना",
    schemesEmpty: "धोका मूल्यांकनानंतर योजना माहिती इथे दिसेल.",
    healthHelpline: "आरोग्य हेल्पलाइन",
    emergency: "आणीबाणी",
    generateAbha: "ABHA हेल्थ ID तयार करा",
    sendPhcAlert: "जवळच्या PHC ला अलर्ट पाठवा",
    phcNotified: "PHC ला WhatsApp द्वारे कळवले आहे",
  },
  Tamil: {
    liveConnection: "நேரடி இணைப்பு",
    speaking: "குரல் உதவியாளர் பேசுகிறது...",
    placeholder: "உங்கள் அறிகுறிகளை எந்த மொழியிலும் எழுதுங்கள்...",
    listening: "உங்கள் அறிகுறிகள் கேட்கப்படுகிறது...",
    send: "அனுப்பு",
    waitingTitle: "அறிகுறிகள் காத்திருக்கிறது",
    waitingBody: "உங்கள் அறிகுறிகளை எழுதுங்கள். அபாயம், பரிசோதனை, PHC வழிகாட்டல் இங்கே வரும்.",
    dashboard: "மருத்துவ பலகை",
    poweredBy: "ICMR மற்றும் இந்திய அரசு வழிகாட்டுதலின் அடிப்படையில்",
    tabs: { risk: "அபாயம்", tests: "சோதனைகள்", rx: "மருந்து", schemes: "திட்டங்கள்", phc: "PHC அறிவிப்பு" },
    summary: "சுருக்கம்",
    immediateActions: "உடனடி நடவடிக்கைகள்",
    doNotDo: "செய்யக்கூடாதவை",
    testsTitle: "தேவையான பரிசோதனைகள்",
    testsEmpty: "மேலும் சில அறிகுறிகள் சேர்த்தால் சோதனை வழிகாட்டல் வரும்.",
    rxWarning: "இது தகவல் மட்டும். மருந்து PHC மருத்துவர் மூலம் மட்டுமே பெற வேண்டும்.",
    rxEmpty: "மருந்து வழிகாட்டலுக்கு மேலும் சில அறிகுறிகள் சேர்க்கவும்.",
    schemesTitle: "பொருந்தும் அரசு திட்டங்கள்",
    schemesEmpty: "அபாய மதிப்பீட்டுக்குப் பிறகு திட்ட விவரம் இங்கே வரும்.",
    healthHelpline: "சுகாதார உதவி எண்",
    emergency: "அவசரம்",
    generateAbha: "ABHA ID உருவாக்கு",
    sendPhcAlert: "அருகிலுள்ள PHC-க்கு அறிவிப்பு அனுப்பு",
    phcNotified: "PHC-க்கு WhatsApp மூலம் தகவல் அனுப்பப்பட்டது",
  },
  Telugu: {
    liveConnection: "ప్రత్యక్ష కనెక్షన్",
    speaking: "వాయిస్ సహాయకుడు మాట్లాడుతున్నాడు...",
    placeholder: "మీ లక్షణాలను ఏ భాషలోనైనా టైప్ చేయండి...",
    listening: "మీ లక్షణాలు వినబడుతున్నాయి...",
    send: "పంపండి",
    waitingTitle: "లక్షణాల కోసం వేచి ఉంది",
    waitingBody: "మీ లక్షణాలను చాట్‌లో రాయండి. ప్రమాదం, పరీక్షలు, PHC సూచనలు ఇక్కడ కనిపిస్తాయి.",
    dashboard: "క్లినికల్ డ్యాష్‌బోర్డ్",
    poweredBy: "ICMR మరియు భారత ప్రభుత్వ ప్రోటోకాళ్ల ఆధారంగా",
    tabs: { risk: "ప్రమాదం", tests: "పరీక్షలు", rx: "ఔషధం", schemes: "పథకాలు", phc: "PHC అలర్ట్" },
    summary: "సారాంశం",
    immediateActions: "తక్షణ చర్యలు",
    doNotDo: "చేయకూడనివి",
    testsTitle: "అవసరమైన పరీక్షలు",
    testsEmpty: "ఇంకా కొన్ని లక్షణాలు జోడిస్తే పరీక్ష సూచనలు వస్తాయి.",
    rxWarning: "ఇది సమాచారం మాత్రమే. మందు PHC వైద్యుడి ద్వారా మాత్రమే తీసుకోవాలి.",
    rxEmpty: "మందు సూచనలకు మరికొన్ని లక్షణాలు జోడించండి.",
    schemesTitle: "వర్తించే ప్రభుత్వ పథకాలు",
    schemesEmpty: "ప్రమాద అంచనా తర్వాత పథకం సమాచారం ఇక్కడ కనిపిస్తుంది.",
    healthHelpline: "ఆరోగ్య హెల్ప్‌లైన్",
    emergency: "అత్యవసరం",
    generateAbha: "ABHA హెల్త్ ID సృష్టించండి",
    sendPhcAlert: "సమీప PHC కు అలర్ట్ పంపండి",
    phcNotified: "PHC కు WhatsApp ద్వారా సమాచారం పంపబడింది",
  },
  Kannada: {
    liveConnection: "ಲೈವ್ ಸಂಪರ್ಕ",
    speaking: "ಧ್ವನಿ ಸಹಾಯಕ ಮಾತನಾಡುತ್ತಿದೆ...",
    placeholder: "ನಿಮ್ಮ ಲಕ್ಷಣಗಳನ್ನು ಯಾವುದೇ ಭಾಷೆಯಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...",
    listening: "ನಿಮ್ಮ ಲಕ್ಷಣಗಳನ್ನು ಕೇಳಲಾಗುತ್ತಿದೆ...",
    send: "ಕಳುಹಿಸಿ",
    waitingTitle: "ಲಕ್ಷಣಗಳ ನಿರೀಕ್ಷೆ",
    waitingBody: "ನಿಮ್ಮ ಲಕ್ಷಣಗಳನ್ನು ಚಾಟ್‌ನಲ್ಲಿ ಬರೆಯಿರಿ. ಅಪಾಯ, ಪರೀಕ್ಷೆಗಳು ಮತ್ತು PHC ಮಾರ್ಗದರ್ಶನ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ.",
    dashboard: "ಕ್ಲಿನಿಕಲ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    poweredBy: "ICMR ಮತ್ತು ಭಾರತ ಸರ್ಕಾರದ ಮಾರ್ಗಸೂಚಿಗಳ ಆಧಾರದಲ್ಲಿ",
    tabs: { risk: "ಅಪಾಯ", tests: "ಪರೀಕ್ಷೆಗಳು", rx: "ಔಷಧ", schemes: "ಯೋಜನೆಗಳು", phc: "PHC ಅಲರ್ಟ್" },
    summary: "ಸಾರಾಂಶ",
    immediateActions: "ತಕ್ಷಣದ ಕ್ರಮಗಳು",
    doNotDo: "ಮಾಡಬಾರದು",
    testsTitle: "ಅಗತ್ಯ ಪರೀಕ್ಷೆಗಳು",
    testsEmpty: "ಇನ್ನಷ್ಟು ಲಕ್ಷಣಗಳನ್ನು ಸೇರಿಸಿದರೆ ಪರೀಕ್ಷೆ ಸಲಹೆ ಕಾಣಿಸುತ್ತದೆ.",
    rxWarning: "ಇದು ಮಾಹಿತಿ ಮಾತ್ರ. ಔಷಧವನ್ನು PHC ವೈದ್ಯರಿಂದಲೇ ಪಡೆಯಿರಿ.",
    rxEmpty: "ಔಷಧ ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ಇನ್ನಷ್ಟು ಲಕ್ಷಣಗಳನ್ನು ಸೇರಿಸಿ.",
    schemesTitle: "ಅನ್ವಯಿಸುವ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
    schemesEmpty: "ಅಪಾಯ ಮೌಲ್ಯಮಾಪನದ ನಂತರ ಯೋಜನೆ ವಿವರ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ.",
    healthHelpline: "ಆರೋಗ್ಯ ಸಹಾಯವಾಣಿ",
    emergency: "ತುರ್ತು",
    generateAbha: "ABHA ಆರೋಗ್ಯ ID ರಚಿಸಿ",
    sendPhcAlert: "ಹತ್ತಿರದ PHC ಗೆ ಅಲರ್ಟ್ ಕಳುಹಿಸಿ",
    phcNotified: "PHC ಗೆ WhatsApp ಮೂಲಕ ಮಾಹಿತಿ ಕಳುಹಿಸಲಾಗಿದೆ",
  },
  Bengali: {
    liveConnection: "লাইভ সংযোগ",
    speaking: "ভয়েস সহায়ক কথা বলছে...",
    placeholder: "আপনার লক্ষণ যে কোনও ভাষায় লিখুন...",
    listening: "আপনার লক্ষণ শোনা হচ্ছে...",
    send: "পাঠান",
    waitingTitle: "লক্ষণের অপেক্ষা",
    waitingBody: "চ্যাটে আপনার লক্ষণ লিখুন। ঝুঁকি, পরীক্ষা আর PHC নির্দেশনা এখানে দেখা যাবে।",
    dashboard: "ক্লিনিকাল ড্যাশবোর্ড",
    poweredBy: "ICMR ও ভারত সরকার প্রোটোকল ভিত্তিক",
    tabs: { risk: "ঝুঁকি", tests: "পরীক্ষা", rx: "ওষুধ", schemes: "স্কিম", phc: "PHC সতর্কতা" },
    summary: "সারাংশ",
    immediateActions: "তাৎক্ষণিক করণীয়",
    doNotDo: "এগুলো করবেন না",
    testsTitle: "প্রয়োজনীয় পরীক্ষা",
    testsEmpty: "আরও কিছু লক্ষণ দিলে পরীক্ষার পরামর্শ দেখা যাবে।",
    rxWarning: "এটি শুধুই তথ্য। ওষুধ অবশ্যই PHC ডাক্তারের পরামর্শে নিন।",
    rxEmpty: "ওষুধের নির্দেশনা পেতে আরও কিছু লক্ষণ যোগ করুন।",
    schemesTitle: "প্রযোজ্য সরকারি স্কিম",
    schemesEmpty: "ঝুঁকি মূল্যায়নের পরে স্কিমের তথ্য এখানে দেখা যাবে।",
    healthHelpline: "স্বাস্থ্য হেল্পলাইন",
    emergency: "জরুরি",
    generateAbha: "ABHA হেলথ ID তৈরি করুন",
    sendPhcAlert: "নিকটবর্তী PHC-তে সতর্কতা পাঠান",
    phcNotified: "PHC-কে WhatsApp-এ জানানো হয়েছে",
  },
};

export default function ChatPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "en-IN";
  const initialLanguage = LOCALE_TO_LANGUAGE[locale] || "English";

  const [language, setLanguage] = useState<LanguageName>(initialLanguage);
  const [messages, setMessages] = useState<Message[]>([{ role: "model", content: GREETINGS[initialLanguage] }]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [riskScores, setRiskScores] = useState<RiskScore[] | null>(null);
  const [clinicalReport, setClinicalReport] = useState<ClinicalReport | null>(null);
  const [activeTab, setActiveTab] = useState<"risk" | "tests" | "rx" | "schemes" | "phc">("risk");
  const [abhaId, setAbhaId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [demoCompleted, setDemoCompleted] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(true);
  const [phcAlertStatus, setPhcAlertStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");

  const copy = UI_COPY[language];
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const requestInFlightRef = useRef(false);

  function playSound(type: "ding" | "success") {
    if (isMuted) return;
    try {
      const audioContextClass =
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!audioContextClass) return;
      const audioCtx = new audioContextClass();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      if (type === "ding") {
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.3);
      } else {
        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime);
        oscillator.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.5);
      }
    } catch {
      console.log("Web Audio not supported");
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setLanguage(LOCALE_TO_LANGUAGE[locale] || "English");
  }, [locale]);

  useEffect(() => {
    setMessages((current) => {
      const hasUserMessages = current.some((message) => message.role === "user");
      if (hasUserMessages) return current;
      return [{ role: "model", content: GREETINGS[language] }];
    });
    setRiskScores(null);
    setClinicalReport(null);
    setActiveTab("risk");
  }, [language]);

  useEffect(() => {
    const speechWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const SpeechRecognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsVoiceSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = SPEECH_INPUT_CODES[language];
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setInput(currentTranscript);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognitionRef.current = recognition;
    setIsVoiceSupported(true);
  }, [language]);

  function speak(text: string, forceLanguage?: string) {
    if (isMuted) return;
    const selectedLanguage = normalizeLanguage(forceLanguage || language) as LanguageName;
    const langCode = SPEECH_OUTPUT_CODES[selectedLanguage];

    setIsSpeaking(true);
    fetch("/api/sarvam", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, target_language_code: langCode }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.audio) {
          const audio = new Audio(data.audio);
          audio.onended = () => setIsSpeaking(false);
          void audio.play();
          return;
        }
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = langCode;
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      })
      .catch(() => {
        setIsSpeaking(false);
      });
  }

  function toggleRecording() {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }
    if (!recognitionRef.current) return;
    recognitionRef.current.lang = SPEECH_INPUT_CODES[language];
    recognitionRef.current.start();
    setIsRecording(true);
  }

  async function sendMessage() {
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading || requestInFlightRef.current) return;

    requestInFlightRef.current = true;
    const newMessages = [...messages, { role: "user", content: trimmedInput } as Message];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, language }),
      });
      if (!response.ok) throw new Error("API failed");

      const data = await response.json();
      setMessages((current) => [...current, { role: "model", content: data.content }]);
      if (data.riskScores) setRiskScores(data.riskScores);
      if (data.report) setClinicalReport(data.report);
      playSound("ding");
      speak(data.content, data.detectedLanguage);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((current) => [...current, { role: "model", content: GREETINGS[language] }]);
      playSound("ding");
    } finally {
      setIsLoading(false);
      requestInFlightRef.current = false;
    }
  }

  async function generateABHA() {
    try {
      const response = await fetch("/api/abha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Demo User", age: 35, village: "Sample Village" }),
      });
      const data = await response.json();
      if (!data.success) return;
      setAbhaId(data.patient.abhaId);
      setQrCode(data.qrCodeDataUrl);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6, x: 0.8 },
        colors: ["#3b82f6", "#10b981", "#ffffff"],
      });
      playSound("success");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-[#0a0f1a] font-sans text-slate-100">
      <div className="relative z-10 flex flex-1 flex-col">
        <header className="shrink-0 border-b border-white/5 bg-[#0f172a]">
          <div className="flex h-20 items-center justify-between gap-6 px-8">
            <div className="flex min-w-0 items-center gap-4">
              <div className="shrink-0 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary to-primary-container p-3 shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-extrabold leading-tight tracking-tight text-white">Aarogya AI</h1>
                <span className="flex items-center gap-2 text-sm font-medium text-green-400">
                  <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-green-400"></span>
                  {isSpeaking ? copy.speaking : copy.liveConnection}
                </span>
              </div>
            </div>

            <div className="hidden shrink-0 items-center gap-1 rounded-2xl border border-white/5 bg-slate-800/60 p-1.5 lg:flex">
              <Link href={`/${locale}/chat`} className="rounded-xl bg-primary px-5 py-2 text-sm font-bold text-white shadow">
                Web Portal
              </Link>
              <Link href={`/${locale}/whatsapp`} className="rounded-xl px-5 py-2 text-sm font-semibold text-slate-400 transition-all hover:bg-slate-700/60 hover:text-white">
                WhatsApp
              </Link>
              <Link href={`/${locale}/ivrs`} className="rounded-xl px-5 py-2 text-sm font-semibold text-slate-400 transition-all hover:bg-slate-700/60 hover:text-white">
                IVRS Call
              </Link>
              <Link href={`/${locale}/asha`} className="rounded-xl px-5 py-2 text-sm font-semibold text-slate-400 transition-all hover:bg-slate-700/60 hover:text-white">
                ASHA Dash
              </Link>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <button
                onClick={() => setIsMuted((current) => !current)}
                className="rounded-xl border border-white/5 bg-slate-800 p-3 transition-colors hover:bg-slate-700"
                title={isMuted ? "Unmute Voice" : "Mute Voice"}
              >
                {isMuted ? <VolumeX className="h-5 w-5 text-slate-400" /> : <Volume2 className="h-5 w-5 text-primary" />}
              </button>
              <div className="relative">
                <select
                  className="cursor-pointer appearance-none rounded-xl border border-white/10 bg-slate-800 py-3 pl-4 pr-10 text-sm font-semibold text-white outline-none transition-colors hover:bg-slate-700"
                  value={language}
                  onChange={(event) => setLanguage(event.target.value as LanguageName)}
                >
                  {LANGUAGE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 mt-1 -translate-y-1/2 border-[5px] border-transparent border-t-white/50"></div>
              </div>
            </div>
          </div>
        </header>

        <div className="custom-scrollbar flex-1 space-y-8 overflow-y-auto p-8 scroll-smooth">
          <div className="mx-auto max-w-4xl space-y-8">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-3xl p-5 text-lg leading-relaxed shadow-xl ${
                      message.role === "user"
                        ? "rounded-tr-sm bg-gradient-to-br from-primary to-primary-container text-white"
                        : "rounded-tl-sm border border-white/5 bg-[#1e293b] text-slate-200 backdrop-blur-md"
                    }`}
                  >
                    {message.role === "model" && (
                      <div className="mb-2 flex items-center gap-2 text-primary opacity-80">
                        <HeartPulse className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Aarogya AI</span>
                      </div>
                    )}
                    {message.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="flex h-[72px] items-center gap-3 rounded-3xl rounded-tl-sm border border-white/5 bg-[#1e293b] p-6 shadow-xl">
                    <span className="h-3 w-3 animate-bounce rounded-full bg-primary"></span>
                    <span className="h-3 w-3 animate-bounce rounded-full bg-primary" style={{ animationDelay: "0.15s" }}></span>
                    <span className="h-3 w-3 animate-bounce rounded-full bg-primary" style={{ animationDelay: "0.3s" }}></span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>

        <div className="z-20 p-8 pt-0">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-center gap-3 rounded-[2rem] border border-white/10 bg-[#1e293b]/90 p-2.5 shadow-2xl ring-1 ring-black/50 backdrop-blur-xl">
              {isVoiceSupported && (
                <button
                  onClick={toggleRecording}
                  className={`shrink-0 rounded-full p-4 transition-all ${
                    isRecording
                      ? "animate-pulse bg-error text-white shadow-lg shadow-error/30"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  {isRecording ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                </button>
              )}
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && void sendMessage()}
                placeholder={isRecording ? copy.listening : copy.placeholder}
                className="flex-1 border-0 bg-transparent px-4 py-4 text-lg text-white outline-none placeholder:text-slate-500"
              />
              <button
                onClick={() => void sendMessage()}
                disabled={!input.trim() || isLoading}
                className="flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-bold text-white shadow-lg transition-all hover:bg-primary-container hover:shadow-primary/30 disabled:opacity-50"
              >
                {copy.send} <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-20 flex w-[480px] shrink-0 flex-col border-l border-white/5 bg-[#0f172a] shadow-2xl">
        <div className="shrink-0 border-b border-white/5 bg-[#1e293b]/30 p-5">
          <h2 className="flex items-center gap-3 text-lg font-bold text-white">
            <Stethoscope className="h-5 w-5 text-tertiary" />
            {copy.dashboard}
          </h2>
          <p className="mt-1 text-xs text-slate-400">{copy.poweredBy}</p>
        </div>

        {!riskScores && (
          <div className="flex flex-1 flex-col items-center justify-center space-y-4 p-8 text-center opacity-60">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-slate-700 bg-slate-800">
              <BrainCircuit className="h-9 w-9 text-slate-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-300">{copy.waitingTitle}</h3>
              <p className="mx-auto max-w-[260px] text-sm text-slate-500">{copy.waitingBody}</p>
            </div>
          </div>
        )}

        {riskScores && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-1 flex-col overflow-hidden">
            <div className="flex shrink-0 overflow-x-auto border-b border-white/5 bg-[#0f172a]">
              {([
                { id: "risk", label: copy.tabs.risk, icon: <Activity className="h-3.5 w-3.5" /> },
                { id: "tests", label: copy.tabs.tests, icon: <FlaskConical className="h-3.5 w-3.5" /> },
                { id: "rx", label: copy.tabs.rx, icon: <Pill className="h-3.5 w-3.5" /> },
                { id: "schemes", label: copy.tabs.schemes, icon: <BookOpen className="h-3.5 w-3.5" /> },
                { id: "phc", label: copy.tabs.phc, icon: <Phone className="h-3.5 w-3.5" /> },
              ] as const).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-4 py-3 text-xs font-bold transition-all ${
                    activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto p-5">
              {activeTab === "risk" && (
                <div className="space-y-4">
                  {clinicalReport?.summary && (
                    <div className="rounded-2xl border border-white/5 bg-slate-800/50 p-4 text-sm leading-relaxed text-slate-300">
                      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">{copy.summary}</p>
                      {clinicalReport.summary}
                    </div>
                  )}
                  {riskScores.map((risk, index) => (
                    <div key={index} className="rounded-2xl border border-white/5 bg-[#1e293b] p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="font-bold text-slate-100">{risk.disease}</span>
                        <span
                          className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                            risk.level === "HIGH"
                              ? "border border-red-500/20 bg-red-500/20 text-red-400"
                              : risk.level === "MEDIUM"
                                ? "border border-amber-500/20 bg-amber-500/20 text-amber-400"
                                : "border border-emerald-500/20 bg-emerald-500/20 text-emerald-400"
                          }`}
                        >
                          {index === 0 ? "Most Probable" : "Least Probable"}
                        </span>
                      </div>
                      <div className="mb-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-900">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${risk.probability}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className={`h-full rounded-full ${
                            risk.level === "HIGH" ? "bg-red-500" : risk.level === "MEDIUM" ? "bg-amber-500" : "bg-emerald-500"
                          }`}
                        />
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {risk.reasons.map((reason, reasonIndex) => (
                          <span key={reasonIndex} className="rounded-lg border border-white/5 bg-slate-900 px-2 py-1 text-xs text-slate-400">
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  {clinicalReport?.immediateActions && (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
                      <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-400">
                        <AlertCircle className="h-3.5 w-3.5" /> {copy.immediateActions}
                      </p>
                      <ul className="space-y-2">
                        {clinicalReport.immediateActions.map((action, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-red-200">
                            <span className="mt-0.5 text-red-400">•</span> {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {clinicalReport?.doNotDo && (
                    <div className="rounded-2xl border border-white/5 bg-slate-800/50 p-4">
                      <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                        <XCircle className="h-3.5 w-3.5 text-red-400" /> {copy.doNotDo}
                      </p>
                      <ul className="space-y-2">
                        {clinicalReport.doNotDo.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-slate-400">
                            <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "tests" && (
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{copy.testsTitle}</p>
                  {clinicalReport?.requiredTests?.length ? (
                    clinicalReport.requiredTests.map((test, index) => (
                      <div key={index} className="rounded-2xl border border-white/5 bg-[#1e293b] p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold text-slate-100">{test.test}</p>
                            <p className="mt-1 text-xs text-slate-400">{test.reason}</p>
                          </div>
                          <span className="shrink-0 whitespace-nowrap rounded-lg border border-emerald-500/20 bg-emerald-500/20 px-2 py-1 text-xs text-emerald-400">
                            {test.cost}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">{copy.testsEmpty}</p>
                  )}
                </div>
              )}

              {activeTab === "rx" && (
                <div className="space-y-3">
                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-400">{copy.rxWarning}</div>
                  {clinicalReport?.prescriptionGuidance?.length ? (
                    clinicalReport.prescriptionGuidance.map((guidance, index) => (
                      <div key={index} className="rounded-2xl border border-white/5 bg-[#1e293b] p-4">
                        <p className="flex items-center gap-2 text-sm font-bold text-slate-100">
                          <Pill className="h-4 w-4 text-primary" /> {guidance.medication}
                        </p>
                        <p className="mt-2 rounded-lg bg-slate-900/50 px-3 py-2 text-xs text-slate-300">{guidance.dosage}</p>
                        <p className="mt-2 text-xs italic text-slate-500">{guidance.notes}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">{copy.rxEmpty}</p>
                  )}
                </div>
              )}

              {activeTab === "schemes" && (
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{copy.schemesTitle}</p>
                  {clinicalReport?.governmentSchemes?.length ? (
                    clinicalReport.governmentSchemes.map((scheme, index) => (
                      <div key={index} className="rounded-2xl border border-white/5 bg-[#1e293b] p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />
                          <p className="text-sm font-bold text-slate-100">{scheme.scheme}</p>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-400">{scheme.benefit}</p>
                        <a href={`tel:${scheme.contact.replace(/\D/g, "")}`} className="mt-3 flex items-center gap-2 text-xs font-bold text-primary hover:underline">
                          <Phone className="h-3.5 w-3.5" /> {scheme.contact}
                        </a>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">{copy.schemesEmpty}</p>
                  )}
                </div>
              )}

              {activeTab === "phc" && (
                <div className="space-y-4">
                  {clinicalReport?.phcContact && (
                    <>
                      <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm leading-relaxed text-slate-300">
                        <ShieldCheck className="mb-2 h-5 w-5 text-primary" />
                        {clinicalReport.phcContact.instructions}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <a
                          href={`tel:${clinicalReport.phcContact.nationalHelpline}`}
                          className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 transition-all hover:bg-blue-500/20"
                        >
                          <Phone className="h-6 w-6 text-blue-400" />
                          <span className="text-xs text-slate-400">{copy.healthHelpline}</span>
                          <span className="text-2xl font-bold text-white">{clinicalReport.phcContact.nationalHelpline}</span>
                        </a>
                        <a
                          href={`tel:${clinicalReport.phcContact.emergencyNumber}`}
                          className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 transition-all hover:bg-red-500/20"
                        >
                          <Phone className="h-6 w-6 text-red-400" />
                          <span className="text-xs text-slate-400">{copy.emergency}</span>
                          <span className="text-2xl font-bold text-white">{clinicalReport.phcContact.emergencyNumber}</span>
                        </a>
                      </div>
                    </>
                  )}

                  <div className="space-y-3 border-t border-white/10 pt-2">
                    {!abhaId && (
                      <button
                        onClick={() => void generateABHA()}
                        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 py-4 font-bold text-white shadow-lg transition-all hover:bg-blue-500 active:scale-95"
                      >
                        <UserCircle className="h-5 w-5" /> {copy.generateAbha}
                      </button>
                    )}
                    {abhaId && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-900/40 to-slate-900 p-5 text-center"
                      >
                        <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-blue-400" />
                        <div className="mb-1 text-xs font-bold uppercase tracking-widest text-blue-300">Ayushman Bharat ID</div>
                        <div className="mb-4 font-mono text-xl font-bold tracking-widest text-white">{abhaId}</div>
                        {qrCode && <img src={qrCode} alt="ABHA QR" className="mx-auto h-32 w-32 rounded-xl border-4 border-white/10 shadow-2xl" />}
                      </motion.div>
                    )}
                    {abhaId && !demoCompleted && (
                      <button
                        onClick={async () => {
                          const userNumber = window.prompt("Enter your WhatsApp number to receive the PHC alert:", "+91");
                          if (!userNumber) return;

                          setPhcAlertStatus("sending");
                          try {
                            const highestRisk = riskScores?.[0]?.disease || "Unknown Condition";
                            const message = `AAROGYA AI PHC ALERT\nPatient ABHA: ${abhaId}\nHigh Risk For: ${highestRisk}\nStatus: Requires immediate consultation.`;
                            const response = await fetch("/api/whatsapp/send", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ Body: message, To: userNumber }),
                            });
                            
                            const result = await response.json().catch(() => ({}));
                            
                            if (!response.ok) {
                              throw new Error(result.error || "Failed to send WhatsApp message");
                            }
                            
                            console.log("PHC Alert result:", result);
                            setDemoCompleted(true);
                            setPhcAlertStatus("sent");
                            playSound("success");
                          } catch (error: any) {
                            console.error("Twilio Alert Failed", error);
                            setPhcAlertStatus("failed");
                            alert("WhatsApp Alert Failed: " + (error.message || "Please ensure you have joined the Twilio Sandbox."));
                          }
                        }}
                        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-tertiary py-4 font-bold text-slate-900 shadow-lg transition-all hover:bg-[#ff9e00] active:scale-95"
                      >
                        <MapPin className="h-5 w-5" /> {copy.sendPhcAlert}
                      </button>
                    )}
                    {demoCompleted && (
                      <div className="flex items-center justify-center gap-3 rounded-2xl border border-primary/30 bg-primary/20 p-4 text-sm font-bold text-primary">
                        <CheckCircle2 className="h-5 w-5" /> {copy.phcNotified}
                      </div>
                    )}
                    {phcAlertStatus === "failed" && (
                      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">
                        WhatsApp alert could not be sent. Please check the configured phone number and WhatsApp settings.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
