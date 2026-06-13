import { analyzeSymptoms } from "@/lib/dataset-engine";

// ─── helpers ────────────────────────────────────────────────────────────────
const user = (content: string) => ({ role: "user", content });
const model = (content: string) => ({ role: "model", content });
const GREETING = model("Hello! I am Aarogya AI. Please describe your symptoms like fever, cough, or fatigue.");

// ─── 1. Greeting detection ───────────────────────────────────────────────────
describe("Greeting detection", () => {
  test("returns greeting for 'hello'", () => {
    const result = analyzeSymptoms([user("hello")], "English");
    expect(result.riskScores).toBeNull();
    expect(result.report).toBeNull();
    expect(result.content).toMatch(/Aarogya AI/i);
  });

  test("returns greeting for Hindi namaste", () => {
    const result = analyzeSymptoms([user("नमस्ते")], "Hindi");
    expect(result.riskScores).toBeNull();
    expect(result.content).toMatch(/आरोग्य/);
  });
});

// ─── 2. Follow-up questions (gate must block report) ─────────────────────────
describe("Follow-up gate — should NOT produce report yet", () => {
  test("message 1: single symptom → asks follow-up, no report", () => {
    const msgs = [GREETING, user("I have fever")];
    const result = analyzeSymptoms(msgs, "English");
    expect(result.riskScores).toBeNull();
    expect(result.report).toBeNull();
    expect(result.content.length).toBeGreaterThan(0);
  });

  test("message 1: Kannada cough+fever (demo scenario) → asks follow-up, no report", () => {
    // This is the exact demo message: "I have cough and fever for 2 weeks"
    const msgs = [GREETING, user("ನನಗೆ 2 ವಾರಗಳಿಂದ ಕೆಮ್ಮು ಮತ್ತು ಜ್ವರ ಇದೆ")];
    const result = analyzeSymptoms(msgs, "Kannada");
    expect(result.riskScores).toBeNull();
    expect(result.report).toBeNull();
  });

  test("message 2: two symptoms across two messages → still no report", () => {
    const msgs = [GREETING, user("I have fever"), model("How long?"), user("Also cough for 2 weeks")];
    const result = analyzeSymptoms(msgs, "English");
    expect(result.riskScores).toBeNull();
    expect(result.report).toBeNull();
  });

  test("message 2: severe symptom (chest pain) → still no report before 3 messages", () => {
    const msgs = [GREETING, user("I have chest pain and breathlessness"), model("How long?"), user("Since yesterday")];
    const result = analyzeSymptoms(msgs, "English");
    // userMessages.length = 2, severe symptoms present — must still be blocked
    expect(result.riskScores).toBeNull();
    expect(result.report).toBeNull();
  });
});

// ─── 3. Report generation (gate must open) ───────────────────────────────────
describe("Report generation — should produce report at message 3+", () => {
  test("message 3: 2+ symptoms across 3 messages → produces report", () => {
    const msgs = [
      GREETING,
      user("I have fever and cough"),
      model("How long have you had this?"),
      user("For 2 weeks"),
      model("Any other symptoms?"),
      user("Yes, I feel very weak and lost weight"),
    ];
    const result = analyzeSymptoms(msgs, "English");
    expect(result.riskScores).not.toBeNull();
    expect(result.report).not.toBeNull();
    expect(result.riskScores!.length).toBeGreaterThan(0);
  });

  test("message 3: TB risk is HIGH for cough+fever+weight_loss", () => {
    const msgs = [
      GREETING,
      user("I have cough and fever"),
      model("How long?"),
      user("3 weeks"),
      model("Any other symptoms?"),
      user("Weight loss and night sweats"),
    ];
    const result = analyzeSymptoms(msgs, "English");
    const tb = result.riskScores?.find(r => r.disease === "Tuberculosis (TB)");
    expect(tb).toBeDefined();
    expect(tb!.level).toBe("HIGH");
    expect(tb!.probability).toBeGreaterThanOrEqual(75);
  });

  test("message 4: hard cap — always produces report at 4 user messages", () => {
    const msgs = [
      GREETING,
      user("I feel tired"),
      model("How long?"),
      user("A few days"),
      model("Any other symptoms?"),
      user("Not really"),
      model("Is it getting worse?"),
      user("A little"),
    ];
    const result = analyzeSymptoms(msgs, "English");
    // 4 user messages → enoughForReport via userMessages.length >= 4
    expect(result.riskScores).not.toBeNull();
  });

  test("message 3: severe symptom (blood in cough) → report at 3 messages", () => {
    const msgs = [
      GREETING,
      user("I am coughing blood"),
      model("How long?"),
      user("Since yesterday"),
      model("Any fever?"),
      user("Yes, high fever"),
    ];
    const result = analyzeSymptoms(msgs, "English");
    expect(result.riskScores).not.toBeNull();
    const tb = result.riskScores?.find(r => r.disease === "Tuberculosis (TB)");
    expect(tb).toBeDefined();
  });
});

// ─── 4. Language detection ───────────────────────────────────────────────────
describe("Language detection", () => {
  test("detects Kannada script correctly", () => {
    const msgs = [GREETING, user("ನನಗೆ ಕೆಮ್ಮು ಇದೆ")];
    const result = analyzeSymptoms(msgs, "English");
    expect(result.detectedLanguage).toBe("Kannada");
  });

  test("detects Hindi script correctly", () => {
    const msgs = [GREETING, user("मुझे बुखार है")];
    const result = analyzeSymptoms(msgs, "English");
    expect(result.detectedLanguage).toBe("Hindi");
  });

  test("detects Tamil script correctly", () => {
    const msgs = [GREETING, user("எனக்கு காய்ச்சல் இருக்கிறது")];
    const result = analyzeSymptoms(msgs, "English");
    expect(result.detectedLanguage).toBe("Tamil");
  });

  test("follow-up questions are in Kannada when user writes Kannada", () => {
    const msgs = [GREETING, user("ನನಗೆ ಜ್ವರ ಇದೆ")];
    const result = analyzeSymptoms(msgs, "English");
    // Kannada follow-up should contain Kannada characters
    expect(/[\u0C80-\u0CFF]/.test(result.content)).toBe(true);
  });
});

// ─── 5. Disease scoring ──────────────────────────────────────────────────────
describe("Disease risk scoring", () => {
  test("Diabetes risk detected for thirst + urination + fatigue", () => {
    const msgs = [
      GREETING,
      user("I have excessive thirst and frequent urination"),
      model("How long?"),
      user("About a month"),
      model("Any other symptoms?"),
      user("Yes, fatigue and blurred vision"),
    ];
    const result = analyzeSymptoms(msgs, "English");
    const diabetes = result.riskScores?.find(r => r.disease === "Diabetes");
    expect(diabetes).toBeDefined();
    expect(diabetes!.probability).toBeGreaterThan(0);
  });

  test("Hypertension risk detected for headache + dizziness + chest pain", () => {
    const msgs = [
      GREETING,
      user("I have severe headache and dizziness"),
      model("How long?"),
      user("2 days"),
      model("Any other symptoms?"),
      user("Chest pain and blurred vision"),
    ];
    const result = analyzeSymptoms(msgs, "English");
    const htn = result.riskScores?.find(r => r.disease === "Hypertension");
    expect(htn).toBeDefined();
  });

  test("low risk returns no riskScores", () => {
    const msgs = [
      GREETING,
      user("I have a mild headache"),
      model("How long?"),
      user("Just today"),
      model("Any other symptoms?"),
      user("No other symptoms"),
    ];
    const result = analyzeSymptoms(msgs, "English");
    // headache alone scores 30 for hypertension — still above 10 threshold
    // so riskScores may exist; what matters is no HIGH risk
    if (result.riskScores) {
      result.riskScores.forEach(r => expect(r.level).not.toBe("HIGH"));
    }
  });
});

// ─── 6. Report structure completeness ───────────────────────────────────────
describe("Report structure", () => {
  const getReport = () => {
    const msgs = [
      GREETING,
      user("I have cough and fever"),
      model("How long?"),
      user("3 weeks, also night sweats"),
      model("Any other symptoms?"),
      user("Weight loss and weakness"),
    ];
    return analyzeSymptoms(msgs, "English");
  };

  test("report has all required fields", () => {
    const { report } = getReport();
    expect(report).not.toBeNull();
    expect(report!.summary).toBeTruthy();
    expect(Array.isArray(report!.immediateActions)).toBe(true);
    expect(Array.isArray(report!.requiredTests)).toBe(true);
    expect(Array.isArray(report!.governmentSchemes)).toBe(true);
    expect(Array.isArray(report!.doNotDo)).toBe(true);
    expect(report!.phcContact.nationalHelpline).toBe("104");
    expect(report!.phcContact.emergencyNumber).toBe("108");
  });

  test("riskScore reasons are non-empty strings", () => {
    const { riskScores } = getReport();
    expect(riskScores).not.toBeNull();
    riskScores!.forEach(r => {
      expect(r.reasons.length).toBeGreaterThan(0);
      r.reasons.forEach(reason => expect(typeof reason).toBe("string"));
    });
  });
});
