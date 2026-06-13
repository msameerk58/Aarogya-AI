import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID || "YOUR_TWILIO_SID";
const authToken  = process.env.TWILIO_AUTH_TOKEN || "YOUR_TWILIO_TOKEN";
const from       = "whatsapp:+14155238886";
const to         = "whatsapp:+918660967760";

const client = twilio(accountSid, authToken);

try {
  const msg = await client.messages.create({
    body: "✅ Aarogya AI Test — PHC Alert working!",
    from,
    to,
  });
  console.log("✅ SUCCESS! SID:", msg.sid);
} catch (err) {
  console.error("❌ TWILIO ERROR:", err.message);
  console.error("   Code:", err.code);
  console.error("   More info:", err.moreInfo);
}
