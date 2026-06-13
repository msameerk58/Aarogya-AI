type SupportedLanguage =
  | "English"
  | "Hindi"
  | "Marathi"
  | "Tamil"
  | "Telugu"
  | "Kannada"
  | "Bengali";

type RiskLevel = "HIGH" | "MEDIUM" | "LOW";

type RiskScore = {
  disease: string;
  probability: number;
  level: RiskLevel;
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

const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  "English",
  "Hindi",
  "Marathi",
  "Tamil",
  "Telugu",
  "Kannada",
  "Bengali",
];

const SYMPTOM_KEYWORDS: Record<string, string[]> = {
  cough: [
    "cough",
    "khansi",
    "khokla",
    "khashi",
    "खांसी",
    "खोकला",
    "কাশি",
    "இருமல்",
    "దగ్గు",
    "ಕೆಮ್ಮು",
    "kemmu",
    "irumal",
    "daggu",
    "kashi",
    "kasa",
  ],
  fever: [
    "fever",
    "bukhar",
    "taap",
    "tap",
    "बुखार",
    "ताप",
    "জ্বর",
    "காய்ச்சல்",
    "జ్వరం",
    "ಜ್ವರ",
    "jwara",
    "kaychal",
    "jvaram",
    "jor",
  ],
  night_sweats: [
    "night sweat",
    "night sweats",
    "raat pasina",
    "ratri gham",
    "iravu viyarvai",
    "ratri chemata",
    "raater gham",
  ],
  weight_loss: [
    "weight loss",
    "wajan kam",
    "wajan kami",
    "tuka ilike",
    "edai ilappu",
    "baruvu taggadam",
    "ojon koma",
  ],
  fatigue: [
    "fatigue",
    "tired",
    "weakness",
    "thakan",
    "thakavat",
    "thakla",
    "थकान",
    "अशक्तपणा",
    "দুর্বলতা",
    "சோர்வு",
    "అలసట",
    "ದಣಿವು",
    "danivu",
    "sorvu",
    "alasata",
    "klanti",
  ],
  breathlessness: [
    "breath",
    "breathing trouble",
    "saans",
    "shwas",
    "shwas ghenyas tras",
    "सांस",
    "श्वास",
    "শ্বাস",
    "மூச்சு",
    "శ్వాస",
    "ಉಸಿರು",
    "usirat",
    "moochu",
    "swasa",
  ],
  thirst: ["thirst", "pyaas", "pyas", "baayarike", "daaham", "trishna"],
  urination: ["urinat", "urine", "peshab", "mutra", "mootram", "prasrab"],
  blurred_vision: ["vision", "blurred", "aankh", "drishti", "parvai", "drushti"],
  headache: ["headache", "sir dard", "डोकेदुखी", "সির দার্দ", "தலைவலி", "తలనొప్పి", "ತಲೆನೋವು", "dokyala dukhate", "talenoovu", "thalaivali", "talanoppi"],
  chest_pain: ["chest", "seena", "सीना", "छाती", "বুকে", "மார்பு", "ఛాతీ", "ಎದೆ", "chati", "ede novu", "marbu vali", "chaati noppi"],
  pale_skin: ["pale", "anemia", "pandhra", "fika", "velir", "paalipovadam"],
  dizziness: ["dizzy", "dizziness", "चक्कर", "गरगर", "মাথা ঘোরা", "தலைசுற்றல்", "తలతిరగడం", "ತಲೆ ಸುತ್ತು", "chakkar", "garagar", "taletirugu", "thalaisuttru"],
  blood_cough: ["blood", "khoon", "खून", "রক্ত", "இரத்தம்", "రక్తం", "ರಕ್ತ", "rakt", "rakta", "rokto"],
  appetite_loss: ["appetite", "bhookh", "भूख", "भूक", "ক্ষুধা", "பசி", "ఆకలి", "ಹಸಿವು", "bhukh", "bhook kami", "hasivilla", "pasi", "akali ledu"],
};

const GREETING_KEYWORDS = [
  "hi", "hello", "hey", "namaste", "namaskar", "vanakkam", "namaskara", "nomoshkar",
  "नमस्ते", "नमस्कार", "வணக்கம்", "నమస్కారం", "ನಮಸ್ಕಾರ", "নমস্কার",
  "hii", "hiii", "helo", "helo", "start", "begin"
];

const GREETINGS: Record<SupportedLanguage, string> = {
  English: "Hello! I am Aarogya AI. Please describe your symptoms like fever, cough, or fatigue.",
  Hindi: "नमस्ते! मैं आरोग्य AI हूं। कृपया अपने लक्षण बताइए, जैसे बुखार, खांसी या थकान।",
  Marathi: "नमस्कार! मी आरोग्य AI आहे. कृपया तुमची लक्षणे सांगा, जसे ताप, खोकला किंवा थकवा.",
  Tamil: "வணக்கம்! நான் ஆரோக்ய AI. தயவுசெய்து உங்கள் அறிகுறிகளை சொல்லுங்கள், உதாரணமாக காய்ச்சல், இருமல் அல்லது சோர்வு.",
  Telugu: "నమస్కారం! నేను ఆరోగ్య AI. దయచేసి మీ లక్షణాలు చెప్పండి, ఉదాహరణకు జ్వరం, దగ్గు లేదా అలసట.",
  Kannada: "ನಮಸ್ಕಾರ! ನಾನು ಆರೋಗ್ಯ AI. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಲಕ್ಷಣಗಳನ್ನು ತಿಳಿಸಿ, ಉದಾಹರಣೆಗೆ ಜ್ವರ, ಕೆಮ್ಮು ಅಥವಾ ದಣಿವು.",
  Bengali: "নমস্কার! আমি আরোগ্য AI। দয়া করে আপনার লক্ষণ বলুন, যেমন জ্বর, কাশি বা ক্লান্তি।",
};

const FOLLOW_UPS: Record<SupportedLanguage, string[]> = {
  English: [
    "How many days have you had this symptom?",
    "Do you also have cough, weakness, or breathing trouble?",
    "Is the symptom getting worse?",
    "Have you lost weight or appetite recently?",
  ],
  Hindi: [
    "यह लक्षण कितने दिनों से है?",
    "क्या खांसी, कमजोरी या सांस लेने में दिक्कत भी है?",
    "क्या यह तकलीफ बढ़ रही है?",
    "क्या हाल में वजन या भूख कम हुई है?",
  ],
  Marathi: [
    "हा त्रास किती दिवसांपासून आहे?",
    "खोकला, अशक्तपणा किंवा श्वास घेण्यास त्रास आहे का?",
    "हा त्रास वाढत आहे का?",
    "अलीकडे वजन किंवा भूक कमी झाली आहे का?",
  ],
  Tamil: [
    "இந்த அறிகுறி எத்தனை நாட்களாக உள்ளது?",
    "இருமல், பலவீனம் அல்லது சுவாச சிரமமும் உள்ளதா?",
    "இந்த பிரச்சனை அதிகரிக்கிறதா?",
    "சமீபத்தில் எடை அல்லது பசி குறைந்ததா?",
  ],
  Telugu: [
    "ఈ లక్షణం ఎన్ని రోజులుగా ఉంది?",
    "దగ్గు, బలహీనতা లేదా శ్వాస ఇబ్బంది కూడా ఉందా?",
    "ఈ సమస్య పెరుగుతోందా?",
    "ఇటీవల బరువు లేదా ఆకలి తగ్గిందా?",
  ],
  Kannada: [
    "ಈ ಲಕ್ಷಣ ಎಷ್ಟು ದಿನಗಳಿಂದ ಇದೆ?",
    "ಕೆಮ್ಮು, ದೌರ್ಬಲ್ಯ ಅಥವಾ ಉಸಿರಾಟದ ತೊಂದರೆ ಕೂಡ ಇದೆಯೆ?",
    "ಈ ತೊಂದರೆ ಹೆಚ್ಚುತ್ತಿದೆಯೆ?",
    "ಇತ್ತೀಚೆಗೆ ತೂಕ ಅಥವಾ ಹಸಿವು ಕಡಿಮೆಯಾಯಿತೆ?",
  ],
  Bengali: [
    "এই লক্ষণ কতদিন ধরে আছে?",
    "কাশি, দুর্বলতা বা শ্বাসকষ্টও আছে কি?",
    "সমস্যাটা কি বাড়ছে?",
    "সম্প্রতি ওজন বা ক্ষুধা কমেছে কি?",
  ],
};

const ACKNOWLEDGEMENTS: Record<SupportedLanguage, string> = {
  English: "I understand. ",
  Hindi: "समझ गया। ",
  Marathi: "समजले. ",
  Tamil: "புரிந்தது. ",
  Telugu: "అర్థమైంది. ",
  Kannada: "ಅರ್ಥವಾಯಿತು. ",
  Bengali: "বুঝেছি। ",
};

const LOW_RISK_MESSAGES: Record<SupportedLanguage, string> = {
  English: "Your symptoms do not look high risk right now. Please rest, drink fluids, and visit the nearest PHC if you do not improve in 2 days.",
  Hindi: "अभी आपके लक्षण ज्यादा गंभीर नहीं लग रहे हैं। आराम करें, पानी पिएं, और 2 दिन में आराम न मिले तो नजदीकी PHC जाएं।",
  Marathi: "सध्या तुमची लक्षणे फार धोकादायक वाटत नाहीत. विश्रांती घ्या, पाणी प्या, आणि 2 दिवसांत बरं नाही वाटलं तर जवळच्या PHC ला जा.",
  Tamil: "இப்போது உங்கள் அறிகுறிகள் அதிக ஆபத்தாக தெரியவில்லை. ஓய்வு எடுத்துக் கொள்ளுங்கள், தண்ணீர் குடியுங்கள், 2 நாட்களில் நலம் இல்லையெனில் அருகிலுள்ள PHC செல்லுங்கள்.",
  Telugu: "ప్రస్తుతం మీ లక్షణాలు ఎక్కువ ప్రమాదంగా కనిపించడం లేదు. విశ్రాంతి తీసుకోండి, ద్రవాలు తాగండి, 2 రోజుల్లో మెరుగుపడకపోతే సమీప PHC కి వెళ్లండి.",
  Kannada: "ಈಗ ನಿಮ್ಮ ಲಕ್ಷಣಗಳು ತುಂಬಾ ಅಪಾಯಕರವಾಗಿ ಕಾಣುತ್ತಿಲ್ಲ. ವಿಶ್ರಾಂತಿ ತೆಗೆದುಕೊಳ್ಳಿ, ನೀರು ಕುಡಿಯಿರಿ, 2 ದಿನಗಳಲ್ಲಿ ಸುಧಾರಿಸದಿದ್ದರೆ ಹತ್ತಿರದ PHC ಗೆ ಹೋಗಿ.",
  Bengali: "এই মুহূর্তে আপনার লক্ষণ খুব ঝুঁকিপূর্ণ মনে হচ্ছে না। বিশ্রাম নিন, পানি খান, আর 2 দিনের মধ্যে ভালো না হলে নিকটবর্তী PHC-তে যান।",
};

const SUMMARY_PREFIX: Record<SupportedLanguage, string> = {
  English: "Based on your symptoms,",
  Hindi: "आपके लक्षणों के आधार पर,",
  Marathi: "तुमच्या लक्षणांवरून,",
  Tamil: "உங்கள் அறிகுறிகளைப் பொறுத்தவரை,",
  Telugu: "మీ లక్షణాల ఆధారంగా,",
  Kannada: "ನಿಮ್ಮ ಲಕ್ಷಣಗಳ ಆಧಾರದ ಮೇಲೆ,",
  Bengali: "আপনার লক্ষণের ভিত্তিতে,",
};

function normalizeLanguage(language: string): SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(language as SupportedLanguage)
    ? (language as SupportedLanguage)
    : "English";
}

function detectScriptLanguage(text: string): SupportedLanguage | null {
  if (/[\u0B80-\u0BFF]/.test(text)) return "Tamil";
  if (/[\u0C00-\u0C7F]/.test(text)) return "Telugu";
  if (/[\u0C80-\u0CFF]/.test(text)) return "Kannada";
  if (/[\u0980-\u09FF]/.test(text)) return "Bengali";
  if (/[\u0900-\u097F]/.test(text)) return "Hindi";
  if (/[a-zA-Z]/.test(text)) return "English";
  return null;
}

function resolveLanguage(text: string, requestedLanguage: string): SupportedLanguage {
  const preferred = normalizeLanguage(requestedLanguage);
  const scripted = detectScriptLanguage(text);
  if (!scripted) return preferred;
  if (scripted === "English" && preferred !== "English") return preferred;
  if (scripted === "Hindi" && preferred === "Marathi") return "Marathi";
  return scripted;
}

function detectSymptoms(text: string): Set<string> {
  const lower = text.toLowerCase();
  const found = new Set<string>();
  for (const [symptom, keywords] of Object.entries(SYMPTOM_KEYWORDS)) {
    if (keywords.some((keyword) => lower.includes(keyword))) {
      found.add(symptom);
    }
  }
  return found;
}

function isGreeting(text: string): boolean {
  const lower = text.toLowerCase().trim();
  return GREETING_KEYWORDS.some(keyword => lower === keyword || lower.startsWith(keyword + " ") || lower.endsWith(" " + keyword));
}

function scoreTB(symptoms: Set<string>, age: number, state: string): number {
  let score = 0;
  if (symptoms.has("cough")) score += 25;
  if (symptoms.has("blood_cough")) score += 30;
  if (symptoms.has("night_sweats")) score += 20;
  if (symptoms.has("weight_loss")) score += 20;
  if (symptoms.has("fever")) score += 10;
  if (symptoms.has("fatigue")) score += 8;
  if (symptoms.has("chest_pain")) score += 10;
  if (symptoms.has("appetite_loss")) score += 7;
  const lowerState = state.toLowerCase();
  if (["uttar pradesh", "bihar", "rajasthan", "jharkhand", "odisha"].some((item) => lowerState.includes(item))) {
    score = Math.min(score * 1.15, 99);
  }
  if (age >= 15 && age <= 45) score = Math.min(score * 1.1, 99);
  return Math.round(Math.min(score, 99));
}

function scoreDiabetes(symptoms: Set<string>, age: number): number {
  let score = 0;
  if (symptoms.has("thirst")) score += 30;
  if (symptoms.has("urination")) score += 25;
  if (symptoms.has("fatigue")) score += 15;
  if (symptoms.has("blurred_vision")) score += 20;
  if (symptoms.has("weight_loss")) score += 15;
  if (symptoms.has("appetite_loss")) score += 10;
  if (age >= 55) score = Math.min(score * 1.2, 99);
  else if (age >= 40) score = Math.min(score * 1.1, 99);
  return Math.round(Math.min(score, 99));
}

function scoreAnemia(symptoms: Set<string>, gender: string): number {
  let score = 0;
  if (symptoms.has("fatigue")) score += 25;
  if (symptoms.has("pale_skin")) score += 30;
  if (symptoms.has("breathlessness")) score += 20;
  if (symptoms.has("dizziness")) score += 20;
  if (symptoms.has("headache")) score += 10;
  if (symptoms.has("weight_loss")) score += 8;
  if (gender.toLowerCase() === "female") score = Math.min(score * 1.2, 99);
  return Math.round(Math.min(score, 99));
}

function scoreHypertension(symptoms: Set<string>, age: number): number {
  let score = 0;
  if (symptoms.has("headache")) score += 30;
  if (symptoms.has("dizziness")) score += 25;
  if (symptoms.has("chest_pain")) score += 25;
  if (symptoms.has("blurred_vision")) score += 15;
  if (symptoms.has("breathlessness")) score += 15;
  if (age >= 50) score = Math.min(score * 1.2, 99);
  else if (age >= 35) score = Math.min(score * 1.1, 99);
  return Math.round(Math.min(score, 99));
}

function scoreCommonCold(symptoms: Set<string>): number {
  let score = 0;
  if (symptoms.has("cough")) score += 30;
  if (symptoms.has("fever")) score += 20;
  if (symptoms.has("headache")) score += 15;
  if (symptoms.has("fatigue")) score += 10;
  return Math.round(Math.min(score, 99));
}

function scoreViralFever(symptoms: Set<string>): number {
  let score = 0;
  if (symptoms.has("fever")) score += 40;
  if (symptoms.has("fatigue")) score += 20;
  if (symptoms.has("headache")) score += 15;
  if (symptoms.has("cough")) score += 10;
  return Math.round(Math.min(score, 99));
}

function getSeasonalAlert(state: string): string | null {
  const month = new Date().getMonth() + 1;
  const lowerState = state.toLowerCase();
  if (month >= 6 && month <= 9) {
    if (lowerState.includes("uttar pradesh") || lowerState.includes("bihar")) {
      return "Monsoon disease season is active. Please report fever quickly.";
    }
    return "Seasonal infections are active. Please monitor fever and dehydration.";
  }
  if (month >= 11 || month <= 2) {
    if (lowerState.includes("uttar pradesh") || lowerState.includes("bihar")) {
      return "Winter TB screening is important if cough lasts over 2 weeks.";
    }
  }
  return null;
}

function getSchemes(disease: string) {
  const common = [{ scheme: "PM-JAY (Ayushman Bharat)", benefit: "Free health insurance up to Rs 5 lakhs/year", contact: "14555" }];
  if (disease === "Tuberculosis (TB)") {
    return [
      { scheme: "NTEP", benefit: "Free TB diagnosis, medicines, and nutrition support", contact: "1800-11-6666" },
      ...common,
    ];
  }
  if (disease === "Diabetes") {
    return [{ scheme: "NHM NCD Programme", benefit: "Free diabetes screening and medicines at PHC", contact: "104" }, ...common];
  }
  if (disease === "Anemia") {
    return [{ scheme: "NHM RMNCH+A", benefit: "Free iron supplements and anemia treatment", contact: "104" }, ...common];
  }
  if (disease === "Common Cold / Flu" || disease === "Viral Fever") {
    return [{ scheme: "General OPD", benefit: "Free consultation and basic medicines at PHC", contact: "104" }, ...common];
  }
  return [{ scheme: "NHM IHCI Programme", benefit: "Free blood pressure medicines and monitoring at PHC", contact: "104" }, ...common];
}

function getTests(disease: string) {
  if (disease === "Tuberculosis (TB)") {
    return [
      { test: "Sputum Smear Microscopy", reason: "Checks for TB bacteria in sputum", cost: "Free under NTEP" },
      { test: "CBNAAT / GeneXpert", reason: "Rapid TB confirmation and drug resistance screening", cost: "Free at district hospital" },
      { test: "Chest X-Ray", reason: "Checks the lungs for infection spread", cost: "Free at PHC or district hospital" },
    ];
  }
  if (disease === "Diabetes") {
    return [
      { test: "Fasting Blood Glucose", reason: "Checks if blood sugar is high", cost: "Free at PHC" },
      { test: "HbA1c Test", reason: "Shows average sugar level over the last 3 months", cost: "Available in government NCD clinics" },
    ];
  }
  if (disease === "Anemia") {
    return [
      { test: "Hemoglobin Test", reason: "Checks blood hemoglobin level", cost: "Free at PHC" },
      { test: "Complete Blood Count (CBC)", reason: "Helps confirm the type of anemia", cost: "Free or low cost at government facility" },
    ];
  }
  if (disease === "Common Cold / Flu" || disease === "Viral Fever") {
    return [
      { test: "Complete Blood Count (CBC)", reason: "Checks for signs of infection", cost: "Free at PHC" },
    ];
  }
  return [
    { test: "Blood Pressure Check", reason: "Confirms elevated blood pressure", cost: "Free at PHC" },
    { test: "ECG", reason: "Checks heart stress if symptoms continue", cost: "Free or low cost at district hospital" },
  ];
}

function getLocalizedClosing(language: SupportedLanguage, disease: string, level: RiskLevel, seasonalAlert: string | null) {
  const alertSuffix = seasonalAlert ? ` ${seasonalAlert}` : "";
  const levelLabel =
    language === "Hindi"
      ? level === "HIGH"
        ? "उच्च"
        : level === "MEDIUM"
          ? "मध्यम"
          : "कम"
      : language === "Marathi"
        ? level === "HIGH"
          ? "जास्त"
          : level === "MEDIUM"
            ? "मध्यम"
            : "कमी"
        : level;

  if (language === "Hindi") {
    return `आपके लक्षणों के आधार पर ${disease} का जोखिम ${levelLabel} है। कृपया नजदीकी PHC जाएं।${alertSuffix}`;
  }
  if (language === "Marathi") {
    return `तुमच्या लक्षणांवरून ${disease} चा धोका ${levelLabel} आहे. कृपया जवळच्या PHC ला जा.${alertSuffix}`;
  }
  if (language === "Tamil") {
    return `${disease} ஆபத்து ${level}. தயவுசெய்து அருகிலுள்ள PHC செல்லுங்கள்.${alertSuffix}`;
  }
  if (language === "Telugu") {
    return `${disease} ప్రమాదం ${level}. దయచేసి సమీప PHC కి వెళ్లండి.${alertSuffix}`;
  }
  if (language === "Kannada") {
    return `${disease} ಅಪಾಯ ${level}. ದಯವಿಟ್ಟು ಹತ್ತಿರದ PHC ಗೆ ಹೋಗಿ.${alertSuffix}`;
  }
  if (language === "Bengali") {
    return `${disease} ঝুঁকি ${level}. অনুগ্রহ করে নিকটবর্তী PHC-তে যান।${alertSuffix}`;
  }
  return `Based on your symptoms, ${disease} risk is ${level}. Please visit your nearest PHC.${alertSuffix}`;
}

function getLocalizedReport(language: SupportedLanguage, disease: string, reasons: string[], score: number): ClinicalReport {
  const summary =
    language === "Hindi"
      ? `मरीज में ${reasons.join(", ")} जैसे लक्षण हैं। यह ${disease} के साथ मेल खाता है और यह सबसे अधिक संभावित है।`
      : language === "Marathi"
        ? `रुग्णात ${reasons.join(", ")} अशी लक्षणे दिसत आहेत. ही ${disease} शी जुळतात आणि हे सर्वात जास्त संभाव्य आहे.`
        : language === "Tamil"
          ? `${reasons.join(", ")} போன்ற அறிகுறிகள் உள்ளன. இது ${disease} உடன் பொருந்துகிறது; இது மிகவும் சாத்தியமானது.`
          : language === "Telugu"
            ? `${reasons.join(", ")} వంటి లక్షణాలు ఉన్నాయి. ఇవి ${disease} కు సరిపోతున్నాయి; ఇది చాలా సంభావ్యమైనది.`
            : language === "Kannada"
              ? `${reasons.join(", ")} ಎಂಬ ಲಕ್ಷಣಗಳು ಕಂಡುಬರುತ್ತಿವೆ. ಇದು ${disease} ಗೆ ಹೊಂದಿಕೆಯಾಗುತ್ತದೆ; ಇದು ಅತ್ಯಂತ ಸಂಭವನೀಯವಾಗಿದೆ.`
              : language === "Bengali"
                ? `${reasons.join(", ")} ধরনের লক্ষণ দেখা যাচ্ছে। এটি ${disease}-এর সঙ্গে মেলে; এটি সবচেয়ে সম্ভাব্য।`
                : `Patient shows ${reasons.join(", ")}. This pattern is consistent with ${disease} and is most probable.`;

  const immediateActions =
    language === "Hindi"
      ? [
          "आज ही नजदीकी PHC या सरकारी अस्पताल जाएं।",
          "खुद से एंटीबायोटिक या स्टेरॉइड शुरू न करें।",
          "अगर सांस लेने में ज्यादा दिक्कत हो तो 108 पर कॉल करें।",
        ]
      : language === "Marathi"
        ? [
            "आजच जवळच्या PHC किंवा सरकारी दवाखान्यात जा.",
            "स्वतःहून अँटिबायोटिक किंवा स्टेरॉइड घेऊ नका.",
            "श्वासाचा त्रास वाढल्यास 108 वर फोन करा.",
          ]
        : [
            "Visit the nearest PHC or government hospital today.",
            "Do not start antibiotics or steroids on your own.",
            "Call 108 immediately if breathing trouble becomes severe.",
          ];

  const doNotDo =
    language === "Hindi"
      ? [
          "2 हफ्ते से ज्यादा खांसी या लगातार बुखार को नजरअंदाज न करें।",
          "डॉक्टर की सलाह के बिना दवा बीच में बंद न करें।",
          "तेज बुखार में एस्पिरिन न लें जब तक डॉक्टर न कहें।",
        ]
      : language === "Marathi"
        ? [
            "2 आठवड्यांपेक्षा जास्त खोकला किंवा सतत ताप दुर्लक्षित करू नका.",
            "डॉक्टरांच्या सल्ल्याशिवाय औषधे मध्येच बंद करू नका.",
            "उच्च तापात डॉक्टर सांगितल्याशिवाय ऍस्पिरिन घेऊ नका.",
          ]
        : [
            "Do not ignore a cough lasting over 2 weeks or persistent fever.",
            "Do not stop medicines midway without medical advice.",
            "Do not take aspirin for fever unless a doctor tells you to.",
          ];

  const phcInstructions =
    language === "Hindi"
      ? "अपना आधार या पहचान पत्र साथ लेकर नजदीकी PHC जाएं। सरकारी योजनाओं के तहत जांच और इलाज कम लागत या मुफ्त हो सकता है।"
      : language === "Marathi"
        ? "आधार किंवा ओळखपत्र घेऊन जवळच्या PHC ला जा. सरकारी योजनांमुळे तपासणी आणि उपचार मोफत किंवा कमी किमतीत मिळू शकतात."
        : "Visit the nearest PHC with an ID card if possible. Tests and treatment may be free or low cost under government schemes.";

  return {
    summary,
    immediateActions,
    requiredTests: getTests(disease),
    prescriptionGuidance: [
      {
        medication: "Paracetamol 500mg",
        dosage: "1 tablet every 6 hours only if fever is above 38 C",
        notes:
          language === "Hindi"
            ? "यह सिर्फ लक्षण राहत के लिए है, इलाज का विकल्प नहीं।"
            : language === "Marathi"
              ? "हे फक्त ताप कमी करण्यासाठी आहे, मुख्य उपचार नाही."
              : "This is only for symptom relief, not a substitute for treatment.",
      },
    ],
    governmentSchemes: getSchemes(disease),
    phcContact: {
      instructions: phcInstructions,
      nationalHelpline: "104",
      emergencyNumber: "108",
    },
    doNotDo,
  };
}

export function analyzeSymptoms(
  messages: { role: string; content: string }[],
  language: string,
  state = "Uttar Pradesh",
  age = 35,
  gender = "Unknown"
): {
  content: string;
  detectedLanguage: SupportedLanguage;
  riskScores: RiskScore[] | null;
  report: ClinicalReport | null;
} {
  const userMessages = messages.filter((message) => message.role === "user");
  const requestedLanguage = normalizeLanguage(language);
  const lastMessage = userMessages[userMessages.length - 1]?.content ?? "";
  const detectedLanguage = resolveLanguage(lastMessage, requestedLanguage);

  // Check if user is just greeting
  if (userMessages.length === 1 && isGreeting(lastMessage)) {
    return {
      content: GREETINGS[detectedLanguage],
      detectedLanguage,
      riskScores: null,
      report: null,
    };
  }

  const allSymptoms = new Set<string>();
  userMessages.forEach((message) => {
    detectSymptoms(message.content).forEach((symptom) => allSymptoms.add(symptom));
  });

  const severeSymptoms = ["blood_cough", "breathlessness", "chest_pain"].some((symptom) => allSymptoms.has(symptom));
  const enoughForReport = (allSymptoms.size >= 2 && userMessages.length >= 3) || userMessages.length >= 4 || (severeSymptoms && userMessages.length >= 3);

  if (userMessages.length === 0) {
    return {
      content: GREETINGS[detectedLanguage],
      detectedLanguage,
      riskScores: null,
      report: null,
    };
  }

  if (!enoughForReport) {
    const followUps = FOLLOW_UPS[detectedLanguage];
    const question = followUps[(userMessages.length - 1) % followUps.length];
    const content = allSymptoms.size > 0 ? `${ACKNOWLEDGEMENTS[detectedLanguage]}${question}` : question;
    return {
      content,
      detectedLanguage,
      riskScores: null,
      report: null,
    };
  }

  const scores = [
    { disease: "Tuberculosis (TB)", score: scoreTB(allSymptoms, age, state), symptoms: ["cough", "blood_cough", "night_sweats", "weight_loss", "fever"] },
    { disease: "Common Cold / Flu", score: scoreCommonCold(allSymptoms), symptoms: ["cough", "fever", "headache", "fatigue"] },
    { disease: "Viral Fever", score: scoreViralFever(allSymptoms), symptoms: ["fever", "fatigue", "headache", "cough"] },
    { disease: "Diabetes", score: scoreDiabetes(allSymptoms, age), symptoms: ["thirst", "urination", "blurred_vision", "fatigue"] },
    { disease: "Anemia", score: scoreAnemia(allSymptoms, gender), symptoms: ["pale_skin", "fatigue", "breathlessness", "dizziness"] },
    { disease: "Hypertension", score: scoreHypertension(allSymptoms, age), symptoms: ["headache", "chest_pain", "dizziness", "blurred_vision"] },
    { disease: "Encephalitis (JE)", score: (allSymptoms.has("fever") && allSymptoms.has("headache") && allSymptoms.has("dizziness")) ? 80 : 0, symptoms: ["fever", "headache", "dizziness", "fatigue"] },
    { disease: "Kala Azar", score: (allSymptoms.has("fever") && allSymptoms.has("weight_loss") && allSymptoms.has("fatigue")) ? 75 : 0, symptoms: ["fever", "weight_loss", "fatigue"] },
    { disease: "Severe Malnutrition", score: (allSymptoms.has("weight_loss") && allSymptoms.has("fatigue") && age <= 5) ? 90 : 0, symptoms: ["weight_loss", "fatigue"] },
    { disease: "Cardiac Emergency", score: (allSymptoms.has("chest_pain") && allSymptoms.has("breathlessness") && allSymptoms.has("dizziness")) ? 95 : 0, symptoms: ["chest_pain", "breathlessness", "dizziness"] },
  ]
    .filter((item) => item.score >= 10)
    .sort((left, right) => right.score - left.score)
    .slice(0, 2);

  if (scores.length === 0) {
    return {
      content: LOW_RISK_MESSAGES[detectedLanguage],
      detectedLanguage,
      riskScores: null,
      report: null,
    };
  }

  const riskScores: RiskScore[] = scores.map((item) => ({
    disease: item.disease,
    probability: item.score,
    level: item.score >= 75 ? "HIGH" : item.score >= 50 ? "MEDIUM" : "LOW",
    reasons: item.symptoms.filter((symptom) => allSymptoms.has(symptom)).map((symptom) => symptom.replace(/_/g, " ")),
  }));

  const top = riskScores[0];
  const seasonalAlert = getSeasonalAlert(state);
  const report = getLocalizedReport(detectedLanguage, top.disease, top.reasons, top.probability);

  return {
    content: getLocalizedClosing(detectedLanguage, top.disease, top.level, seasonalAlert),
    detectedLanguage,
    riskScores,
    report,
  };
}

export { GREETINGS, normalizeLanguage };
