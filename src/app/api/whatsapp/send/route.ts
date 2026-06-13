import { NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(req: Request) {
  try {
    const bodyJson = await req.json();
    const Body = bodyJson.Body;
    const targetNumber = bodyJson.To || bodyJson.From;

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    let fromNumber = process.env.TWILIO_PHONE_NUMBER || "whatsapp:+14155238886";
    if (fromNumber && !fromNumber.startsWith("whatsapp:")) {
      fromNumber = `whatsapp:${fromNumber.startsWith('+') ? fromNumber : '+' + fromNumber}`;
    }

    // Format destination number (make sure it has whatsapp: prefix)
    let toNumber = targetNumber;
    if (toNumber && !toNumber.startsWith("whatsapp:")) {
      toNumber = `whatsapp:${toNumber.startsWith('+') ? toNumber : '+' + toNumber}`;
    }

    if (!accountSid || accountSid.length < 10 || !authToken || authToken.length < 10) {
      // Mock mode: simulate delay
      return NextResponse.json({ success: true, isMock: true, message: "Mock message sent successfully!" });
    }

    // Real mode: Send via Twilio API
    try {
      const client = twilio(accountSid, authToken);
      const message = await client.messages.create({
        body: Body,
        from: fromNumber,
        to: toNumber,
      });
      return NextResponse.json({ success: true, messageSid: message.sid, isMock: false });
    } catch (twilioError: any) {
      // Return the real error so the UI can show failure
      return NextResponse.json({ success: false, error: twilioError.message }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to send message" }, { status: 500 });
  }
}
