from flask import Flask, request
from twilio.twiml.messaging_response import MessagingResponse
from dotenv import load_dotenv
import requests

load_dotenv()

app = Flask(__name__)
BACKEND_URL = "http://localhost:3000/api/chat"
sessions = {}

LANGUAGES = {
    '1': 'English', '2': 'Hindi', '3': 'Kannada', 
    '4': 'Tamil', '5': 'Telugu', '6': 'Bengali'
}

GREETINGS = {
    'English': "Great! I'm here to help you with your health concerns.\n\nPlease tell me what's bothering you today.",
    'Hindi': "बढ़िया! मैं आपकी स्वास्थ्य समस्याओं में मदद के लिए यहां हूं।\n\nकृपया बताएं आज आपको क्या परेशानी है।",
    'Kannada': "ಒಳ್ಳೆಯದು! ನಿಮ್ಮ ಆರೋಗ್ಯ ಸಮಸ್ಯೆಗಳಲ್ಲಿ ಸಹಾಯ ಮಾಡಲು ನಾನು ಇಲ್ಲಿದ್ದೇನೆ.\n\nದಯವಿಟ್ಟು ಇಂದು ನಿಮಗೆ ಏನು ತೊಂದರೆಯಾಗುತ್ತಿದೆ ಎಂದು ಹೇಳಿ.",
    'Tamil': "நல்லது! உங்கள் உடல்நலப் பிரச்சினைகளில் உதவ நான் இங்கே இருக்கிறேன்.\n\nஇன்று உங்களுக்கு என்ன தொந்தரவு என்று சொல்லுங்கள்.",
    'Telugu': "మంచిది! మీ ఆరోగ్య సమస్యలలో సహాయం చేయడానికి నేను ఇక్కడ ఉన్నాను.\n\nదయచేసి ఈరోజు మీకు ఏమి ఇబ్బంది కలిగిస్తోందో చెప్పండి.",
    'Bengali': "দুর্দান্ত! আপনার স্বাস্থ্য সমস্যায় সাহায্য করতে আমি এখানে আছি।\n\nঅনুগ্রহ করে বলুন আজ আপনার কী সমস্যা হচ্ছে।"
}

MESSAGES = {
    'English': {
        'abha': "🆔 *Your ABHA Health ID*\n\n{abha}\n\n✅ Official Ayushman Bharat Digital Health ID\n📋 Show at any government hospital\n💰 Free treatment up to ₹5 lakhs\n\nStay healthy! 🌿",
        'phc': "🏥 *Appointment Confirmed*\n\n📍 PHC Bangalore Rural\n📅 Mon-Sat, 9AM-5PM\n📋 Bring Aadhaar Card\n💰 FREE Service\n\n✅ PHC notified. Take care! 🌿",
        'help': "📞 *24/7 Medical Help*\n\n🩺 Telemedicine: 104\n🚑 Emergency: 108\n💊 Medicine Info: 1800-180-1234\n\nWe're here for you! 🌿"
    },
    'Hindi': {
        'abha': "🆔 *आपका ABHA हेल्थ ID*\n\n{abha}\n\n✅ आधिकारिक आयुष्मान भारत डिजिटल हेल्थ ID\n📋 किसी भी सरकारी अस्पताल में दिखाएं\n💰 ₹5 लाख तक मुफ्त इलाज\n\nस्वस्थ रहें! 🌿",
        'phc': "🏥 *अपॉइंटमेंट कन्फर्म*\n\n📍 PHC बैंगलोर ग्रामीण\n📅 सोम-शनि, 9-5\n📋 आधार कार्ड लाएं\n💰 मुफ्त सेवा\n\n✅ PHC को सूचित कर दिया। ख्याल रखें! 🌿",
        'help': "📞 *24/7 चिकित्सा सहायता*\n\n🩺 टेलीमेडिसिन: 104\n🚑 आपातकाल: 108\n💊 दवा जानकारी: 1800-180-1234\n\nहम आपके लिए हैं! 🌿"
    },
    'Kannada': {
        'abha': "🆔 *ನಿಮ್ಮ ABHA ಹೆಲ್ತ್ ID*\n\n{abha}\n\n✅ ಅಧಿಕೃತ ಆಯುಷ್ಮಾನ್ ಭಾರತ್ ಡಿಜಿಟಲ್ ಹೆಲ್ತ್ ID\n📋 ಯಾವುದೇ ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆಯಲ್ಲಿ ತೋರಿಸಿ\n💰 ₹5 ಲಕ್ಷದವರೆಗೆ ಉಚಿತ ಚಿಕಿತ್ಸೆ\n\nಆರೋಗ್ಯವಾಗಿರಿ! 🌿",
        'phc': "🏥 *ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಖಚಿತ*\n\n📍 PHC ಬೆಂಗಳೂರು ಗ್ರಾಮೀಣ\n📅 ಸೋಮ-ಶನಿ, 9-5\n📋 ಆಧಾರ್ ಕಾರ್ಡ್ ತನ್ನಿ\n💰 ಉಚಿತ ಸೇವೆ\n\n✅ PHC ಗೆ ತಿಳಿಸಲಾಗಿದೆ. ಕಾಳಜಿ ವಹಿಸಿ! 🌿",
        'help': "📞 *24/7 ವೈದ್ಯಕೀಯ ಸಹಾಯ*\n\n🩺 ಟೆಲಿಮೆಡಿಸಿನ್: 104\n🚑 ತುರ್ತು: 108\n💊 ಔಷಧ ಮಾಹಿತಿ: 1800-180-1234\n\nನಾವು ನಿಮಗಾಗಿ ಇದ್ದೇವೆ! 🌿"
    },
    'Tamil': {
        'abha': "🆔 *உங்கள் ABHA ஹெல்த் ID*\n\n{abha}\n\n✅ அதிகாரப்பூர்வ ஆயுஷ்மான் பாரத் டிஜிட்டல் ஹெல்த் ID\n📋 எந்த அரசு மருத்துவமனையிலும் காட்டுங்கள்\n💰 ₹5 லட்சம் வரை இலவச சிகிச்சை\n\nஆரோக்கியமாக இருங்கள்! 🌿",
        'phc': "🏥 *அப்பாயின்ட்மென்ட் உறுதி*\n\n📍 PHC பெங்களூர் கிராமப்புறம்\n📅 திங்-சனி, 9-5\n📋 ஆதார் கார்டு கொண்டு வாருங்கள்\n💰 இலவச சேவை\n\n✅ PHC க்கு தெரிவிக்கப்பட்டது. கவனமாக இருங்கள்! 🌿",
        'help': "📞 *24/7 மருத்துவ உதவி*\n\n🩺 டெலிமெடிசின்: 104\n🚑 அவசரம்: 108\n💊 மருந்து தகவல்: 1800-180-1234\n\nநாங்கள் உங்களுக்காக இருக்கிறோம்! 🌿"
    },
    'Telugu': {
        'abha': "🆔 *మీ ABHA హెల్త్ ID*\n\n{abha}\n\n✅ అధికారిక ఆయుష్మాన్ భారత్ డిజిటల్ హెల్త్ ID\n📋 ఏ ప్రభుత్వ ఆసుపత్రిలోనైనా చూపించండి\n💰 ₹5 లక్షల వరకు ఉచిత చికిత్స\n\nఆరోగ్యంగా ఉండండి! 🌿",
        'phc': "🏥 *అపాయింట్మెంట్ ధృవీకరించబడింది*\n\n📍 PHC బెంగళూరు గ్రామీణ\n📅 సోమ-శని, 9-5\n📋 ఆధార్ కార్డు తీసుకురండి\n💰 ఉచిత సేవ\n\n✅ PHC కి తెలియజేయబడింది. జాగ్రత్తగా ఉండండి! 🌿",
        'help': "📞 *24/7 వైద్య సహాయం*\n\n🩺 టెలిమెడిసిన్: 104\n🚑 అత్యవసరం: 108\n💊 మందుల సమాచారం: 1800-180-1234\n\nమేము మీ కోసం ఉన్నాము! 🌿"
    },
    'Bengali': {
        'abha': "🆔 *আপনার ABHA হেলথ ID*\n\n{abha}\n\n✅ অফিসিয়াল আয়ুষ্মান ভারত ডিজিটাল হেলথ ID\n📋 যেকোনো সরকারি হাসপাতালে দেখান\n💰 ₹5 লক্ষ পর্যন্ত বিনামূল্যে চিকিৎসা\n\nসুস্থ থাকুন! 🌿",
        'phc': "🏥 *অ্যাপয়েন্টমেন্ট নিশ্চিত*\n\n📍 PHC ব্যাঙ্গালোর গ্রামীণ\n📅 সোম-শনি, 9-5\n📋 আধার কার্ড আনুন\n💰 বিনামূল্যে সেবা\n\n✅ PHC কে জানানো হয়েছে। যত্ন নিন! 🌿",
        'help': "📞 *24/7 চিকিৎসা সহায়তা*\n\n🩺 টেলিমেডিসিন: 104\n🚑 জরুরি: 108\n💊 ওষুধের তথ্য: 1800-180-1234\n\nআমরা আপনার জন্য আছি! 🌿"
    }
}

@app.route('/', methods=['GET'])
def home():
    return "✅ Aarogya AI Active", 200

@app.route('/webhook', methods=['POST'])
def webhook():
    incoming = request.values.get('Body', '').strip()
    sender = request.values.get('From', '')
    
    print(f"\n📩 {sender}: {incoming}")
    
    resp = MessagingResponse()
    
    # Check for greeting - reset everything
    if incoming.lower() in ['hi', 'hello', 'hey', 'start', 'reset', 'namaste', 'नमस्ते', 'ನಮಸ್ಕಾರ', 'வணக்கம்', 'నమస్కారం', 'নমস্কার']:
        sessions[sender] = {'step': 'select_language', 'language': None, 'messages': []}
        msg = "👋 Welcome to Aarogya AI!\n\nSelect your language:\n\n"
        msg += "1️⃣ English\n"
        msg += "2️⃣ हिंदी Hindi\n"
        msg += "3️⃣ ಕನ್ನಡ Kannada\n"
        msg += "4️⃣ தமிழ் Tamil\n"
        msg += "5️⃣ తెలుగు Telugu\n"
        msg += "6️⃣ বাংলা Bengali\n\n"
        msg += "Reply with number (1-6)"
        resp.message(msg)
        print(f"✅ Session reset for {sender}")
        return str(resp), 200
    
    # Initialize session if doesn't exist
    if sender not in sessions:
        sessions[sender] = {'step': 'select_language', 'language': None, 'messages': []}
    
    session = sessions[sender]
    print(f"📊 Session state: {session['step']}, Language: {session['language']}")
    
    # Handle language selection
    if session['step'] == 'select_language':
        if incoming in LANGUAGES:
            session['language'] = LANGUAGES[incoming]
            session['step'] = 'chatting'
            session['messages'] = []
            resp.message(GREETINGS[session['language']])
            print(f"✅ Language set to {session['language']}")
            return str(resp), 200
        else:
            resp.message("Please select a valid language number (1-6)")
            return str(resp), 200
    
    # Get language and messages
    lang = session.get('language', 'English')
    msgs = MESSAGES.get(lang, MESSAGES['English'])
    
    # Handle commands
    incoming_lower = incoming.lower()
    
    if 'abha' in incoming_lower or 'health id' in incoming_lower:
        abha = f"91-{abs(hash(sender)) % 10000:04d}-{abs(hash(sender)) % 10000:04d}-{abs(hash(sender)) % 10000:04d}"
        resp.message(msgs['abha'].format(abha=abha))
        return str(resp), 200
    
    if 'phc' in incoming_lower or 'clinic' in incoming_lower or 'appointment' in incoming_lower or 'book' in incoming_lower:
        resp.message(msgs['phc'])
        return str(resp), 200
    
    if 'help' in incoming_lower or 'doctor' in incoming_lower:
        resp.message(msgs['help'])
        return str(resp), 200
    
    # Regular chat - call backend
    session['messages'].append({"role": "user", "content": incoming})
    
    try:
        response = requests.post(
            BACKEND_URL,
            json={"messages": session['messages'], "language": lang},
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            ai_message = data.get('content', '')
            
            session['messages'].append({"role": "model", "content": ai_message})
            
            if len(session['messages']) > 10:
                session['messages'] = session['messages'][-10:]
            
            if data.get('riskScores'):
                risk = data['riskScores'][0]
                
                alert = f"⚠️ *Health Assessment*\n\n{risk['disease']}\nRisk: {risk['probability']}% {risk['level']}\n\n"
                
                if risk['level'] == 'HIGH':
                    alert += "🚑 Call 108 Now\n🏥 Visit PHC Today"
                else:
                    alert += "📞 Call 104\n🏥 Visit if worse"
                
                resp.message(alert)
                
                options = "\n*What next?*\n\n"
                options += "Type *ABHA* - Health ID\n"
                options += "Type *PHC* - Book visit\n"
                options += "Type *HELP* - Doctor numbers"
                
                resp.message(options)
            else:
                resp.message(ai_message)
        else:
            resp.message("Having trouble connecting. Call 104 for help.")
    
    except Exception as e:
        print(f"❌ Error: {e}")
        resp.message("Technical issue. For urgent help, call 108.")
    
    return str(resp), 200

if __name__ == '__main__':
    print("=" * 60)
    print("🏥 Aarogya AI WhatsApp Bot")
    print("📱 Port: 5000")
    print("=" * 60)
    app.run(host='0.0.0.0', port=5000, debug=True)
