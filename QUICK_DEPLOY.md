# 🚀 Quick Deploy to Vercel (5 Minutes)

## Step 1: Secure Your Credentials (2 min)

### Get New API Keys:
1. **Gemini API** (Required): https://makersuite.google.com/app/apikey
2. **Twilio** (Optional): https://console.twilio.com - Get new credentials
3. **Sarvam AI** (Optional): https://dashboard.sarvam.ai - Get new key
4. **Groq** (Optional): https://console.groq.com - Get new key

## Step 2: Push to GitHub (1 min)

```bash
# Initialize git (if not already)
git init

# Add all files (ensure .env is in .gitignore)
git add .

# Commit
git commit -m "Ready for deployment"

# Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/aarogya-ai.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel (2 min)

1. Go to https://vercel.com
2. Click "Import Project"
3. Select your GitHub repository
4. Add Environment Variables:

```
DATABASE_URL=file:./dev.db
GEMINI_API_KEY=your_new_gemini_key
TWILIO_ACCOUNT_SID=your_new_twilio_sid
TWILIO_AUTH_TOKEN=your_new_twilio_token
TWILIO_PHONE_NUMBER=whatsapp:+14155238886
SARVAM_API_KEY=your_new_sarvam_key
GROQ_API_KEY=your_new_groq_key
```

5. Click "Deploy"

## Step 4: Post-Deployment

After deployment completes:

1. Visit your app at `https://your-app.vercel.app`
2. Test IVRS language selection (press 1-7)
3. Test chat interface
4. Configure Twilio webhook URL:
   - Go to Twilio Console → WhatsApp Sandbox
   - Set webhook to: `https://your-app.vercel.app/api/whatsapp/webhook`

## ⚠️ Known Limitations with SQLite on Vercel

Vercel's serverless functions are stateless, so SQLite won't persist data between requests.

### Quick Fix for Demo:
The app will work but won't save patient data permanently.

### Production Fix:
Migrate to PostgreSQL:

```bash
# 1. Create free PostgreSQL database at:
# - Vercel Postgres (https://vercel.com/storage/postgres)
# - Neon (https://neon.tech)
# - Supabase (https://supabase.com)

# 2. Update DATABASE_URL in Vercel environment variables
DATABASE_URL=postgresql://user:pass@host:5432/db

# 3. Update prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

# 4. Redeploy
```

## 🎉 Done!

Your app is now live and ready for the hackathon demo!
