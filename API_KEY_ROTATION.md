# 🔐 API Key Rotation Guide

## ⚠️ IMPORTANT: Your Current Keys Were Exposed

API keys were previously visible and MUST be rotated immediately:
- Twilio Account SID: (REDACTED)
- Twilio Auth Token: (REDACTED)
- Sarvam API Key: (REDACTED)
- Groq API Key: (REDACTED)

---

## 🔄 Step-by-Step Key Rotation

### 1. Twilio (WhatsApp Integration)

#### Option A: Get New Credentials (Recommended)
1. Go to https://console.twilio.com
2. Log in to your account
3. Navigate to **Account → API Keys & Tokens**
4. Click **"Create new API Key"**
5. Copy the new SID and Token
6. **Delete the old token** from the dashboard

#### Option B: Use Existing Sandbox (Quick)
If you just want to test, you can keep using the sandbox:
1. Go to https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
2. Your sandbox number is already set up
3. The credentials shown there are safe to use for testing
4. For production, create a new API key as shown in Option A

**What to update in .env:**
```env
TWILIO_ACCOUNT_SID=AC_your_new_sid_here
TWILIO_AUTH_TOKEN=your_new_auth_token_here
TWILIO_PHONE_NUMBER=whatsapp:+14155238886
```

---

### 2. Sarvam AI (Text-to-Speech)

1. Go to https://dashboard.sarvam.ai
2. Log in to your account
3. Navigate to **API Keys** section
4. Click **"Revoke"** on the old key (sk_t2b8kixy...)
5. Click **"Create New API Key"**
6. Copy the new key immediately (it won't be shown again)

**What to update in .env:**
```env
SARVAM_API_KEY=sk_your_new_key_here
```

**Note:** If you don't have a Sarvam account or want to skip this:
```env
SARVAM_API_KEY=
```
The app will automatically fall back to browser text-to-speech.

---

### 3. Groq (AI Chat)

1. Go to https://console.groq.com
2. Log in to your account
3. Navigate to **API Keys** section
4. Find the old key (gsk_Qaqf7D87...) and click **"Delete"**
5. Click **"Create API Key"**
6. Give it a name (e.g., "Aarogya AI Production")
7. Copy the new key

**What to update in .env:**
```env
GROQ_API_KEY=gsk_your_new_key_here
```

**Note:** Groq is free and fast. Highly recommended to keep it.

---

### 4. Google Gemini (Required - Currently Missing)

1. Go to https://makersuite.google.com/app/apikey
   OR https://aistudio.google.com/app/apikey
2. Log in with your Google account
3. Click **"Create API Key"**
4. Select a Google Cloud project (or create a new one)
5. Copy the API key

**What to update in .env:**
```env
GEMINI_API_KEY=AIzaSy_your_new_key_here
```

**Note:** This is REQUIRED for the app to work properly. Gemini is free for testing.

---

## 📝 Complete Updated .env File

After rotating all keys, your `.env` should look like this:

```env
# Database
DATABASE_URL="file:./dev.db"

# Google Gemini API Key (REQUIRED)
GEMINI_API_KEY=AIzaSy_your_new_gemini_key

# Twilio WhatsApp (Optional - for WhatsApp bot)
TWILIO_ACCOUNT_SID=AC_your_new_twilio_sid
TWILIO_AUTH_TOKEN=your_new_twilio_token
TWILIO_PHONE_NUMBER=whatsapp:+14155238886

# Sarvam AI TTS (Optional - falls back to browser TTS)
SARVAM_API_KEY=sk_your_new_sarvam_key

# Groq API (Optional but recommended - free and fast)
GROQ_API_KEY=gsk_your_new_groq_key

# Base URL (auto-set by deployment platform)
BASE_URL=
```

---

## ✅ Verification Steps

After updating your `.env` file:

### 1. Test Locally
```bash
# Stop the dev server if running (Ctrl+C)

# Restart the dev server
npm run dev
```

### 2. Test Each Feature
- **Chat Interface** (`http://localhost:3000/en-IN/chat`)
  - Should work with Gemini/Groq
  
- **Voice Output** 
  - Should use Sarvam if key is valid, otherwise browser TTS
  
- **WhatsApp** (`http://localhost:3000/en-IN/whatsapp`)
  - Test sending a message (requires valid Twilio credentials)

### 3. Check Console for Errors
Open browser DevTools (F12) and check for any API errors.

---

## 🚀 For Deployment

### If deploying to Vercel:
1. **DO NOT** commit your `.env` file to Git
2. Add environment variables in Vercel Dashboard:
   - Go to your project → Settings → Environment Variables
   - Add each key-value pair manually
   - Click "Save"

### If deploying to other platforms:
- **AWS Amplify:** Use Environment Variables section
- **Railway:** Use Variables tab
- **Render:** Use Environment section
- **Heroku:** Use Config Vars

---

## 🔒 Security Best Practices

### ✅ DO:
- Store keys in environment variables
- Use different keys for development and production
- Rotate keys regularly (every 3-6 months)
- Delete old keys after rotation
- Use `.env.local` for local development (not tracked by Git)

### ❌ DON'T:
- Commit `.env` files to Git
- Share keys in chat/email/Slack
- Use production keys in development
- Hardcode keys in source code
- Screenshot keys

---

## 🆘 Troubleshooting

### "Invalid API Key" Error
- Double-check you copied the entire key (no spaces)
- Ensure the key is active in the provider's dashboard
- Try regenerating the key

### "Rate Limit Exceeded"
- You've hit the free tier limit
- Wait for the limit to reset (usually 24 hours)
- Or upgrade to a paid plan

### "Authentication Failed"
- For Twilio: Ensure both SID and Token are correct
- For others: Regenerate the key and try again

---

## 📞 Support Links

- **Twilio Support:** https://support.twilio.com
- **Sarvam AI:** https://sarvam.ai/contact
- **Groq:** https://console.groq.com/docs
- **Google Gemini:** https://ai.google.dev/gemini-api/docs

---

## ⏱️ Estimated Time

- Twilio: 3-5 minutes
- Sarvam AI: 2-3 minutes
- Groq: 2-3 minutes
- Gemini: 2-3 minutes

**Total: ~10-15 minutes**

---

## ✅ Checklist

- [ ] Rotated Twilio credentials
- [ ] Rotated Sarvam API key (or left blank)
- [ ] Rotated Groq API key
- [ ] Generated Gemini API key
- [ ] Updated `.env` file
- [ ] Tested locally
- [ ] Verified all features work
- [ ] Ready to deploy!

---

**After completing these steps, your application will be secure and ready for deployment! 🎉**
