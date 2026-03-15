# 🌿 MindEase — AI Mental Health Platform

> **Therapy for Everyone, Starting at $4.99**

MindEase is a full-stack mental health platform with an AI therapist called **Sage**, mood tracking, journaling, and crisis support. Built as a better, cheaper alternative to BetterHelp.

---

## ⚠️ Important Disclaimer

**Sage is an AI assistant and not a licensed therapist.** MindEase is not a substitute for professional mental health care. For clinical support, please consult a qualified mental health professional.

**In a mental health crisis, call iCall immediately: 9152987821**

---

## 🚀 Quick Start (Windows)

### Option 1: Double-click to launch
1. Complete the setup steps below first
2. Double-click **`Start MindEase.bat`**
3. Two terminal windows will open (backend + frontend)
4. Visit `http://localhost:3000`

### Option 2: Manual start

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.template .env
# Edit .env with your API keys
python main.py
```

**Frontend (new terminal):**
```bash
cd frontend
npm install
npm start
```

---

## 🔑 Environment Setup

Edit `backend/.env` with your API keys:

```env
GROQ_API_KEY=your-groq-key-here
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-secret
JWT_SECRET=any-random-secret-string-here
DATABASE_URL=sqlite:///./mindease.db
```

### Getting API Keys:

**Groq (Free AI API):**
1. Visit https://console.groq.com
2. Sign up for free
3. Create API key → copy to `GROQ_API_KEY`

**PayPal Sandbox:**
1. Visit https://developer.paypal.com
2. Create sandbox app
3. Copy Client ID and Secret to `.env`

---

## 📁 Project Structure

```
mindease/
├── backend/
│   ├── main.py          ← FastAPI app entry point
│   ├── auth.py          ← JWT authentication
│   ├── chat.py          ← Sage AI therapist
│   ├── mood.py          ← Mood logging
│   ├── journal.py       ← Journal entries
│   ├── payment.py       ← PayPal payments
│   ├── models.py        ← Database models
│   ├── database.py      ← SQLAlchemy setup
│   ├── requirements.txt
│   └── .env.template
├── frontend/
│   └── src/
│       ├── App.jsx        ← Router + auth context
│       ├── pages/
│       │   ├── Landing.jsx
│       │   ├── Login.jsx
│       │   ├── Signup.jsx
│       │   ├── Onboarding.jsx
│       │   ├── Chat.jsx        ← Talk to Sage
│       │   ├── Dashboard.jsx
│       │   ├── MoodTracker.jsx
│       │   ├── Journal.jsx
│       │   ├── Pricing.jsx
│       │   ├── Crisis.jsx
│       │   ├── TermsOfService.jsx
│       │   ├── PrivacyPolicy.jsx
│       │   └── RefundPolicy.jsx
│       └── components/
│           ├── Navbar.jsx
│           ├── Footer.jsx
│           ├── MoodChart.jsx
│           ├── CrisisAlert.jsx
│           └── (more)
├── Start MindEase.bat   ← Double-click to start everything
└── README.md
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/user/profile` | Get profile |
| POST | `/api/chat/message` | Chat with Sage |
| GET | `/api/chat/history` | Session history |
| POST | `/api/mood/log` | Log mood entry |
| GET | `/api/mood/history` | Mood history |
| POST | `/api/journal/entry` | Save journal entry |
| GET | `/api/journal/entries` | Get all entries |
| POST | `/api/payment/create-order` | Create PayPal order |
| POST | `/api/payment/capture-order` | Capture payment |

API Docs (Swagger): http://localhost:8000/docs

---

## 💰 Pricing Plans

| Plan | Price | Sessions | Features |
|------|-------|----------|---------|
| Basic | $4.99/mo | 10/month | Mood tracker, crisis support |
| Standard | $7.99/mo | Unlimited | + Journal, session history |
| Premium | $9.99/mo | Unlimited | + Weekly reports, downloads |

---

## 🆘 Crisis Resources (Always Visible)

- **iCall (India):** 9152987821
- **Vandrevala Foundation:** 1860-2662-345
- **AASRA:** 9820466627
- **Emergency (India):** 112

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Tailwind CSS |
| Backend | Python + FastAPI |
| AI | Groq (llama-3.3-70b) via LangChain |
| Auth | JWT + bcrypt |
| Database | SQLite + SQLAlchemy |
| Payments | PayPal SDK (sandbox) |
| Charts | Recharts |

---

## 🐛 Troubleshooting

**Backend won't start:**
- Make sure Python 3.11+ is installed: `python --version`
- Activate venv: `venv\Scripts\activate`
- Install deps: `pip install -r requirements.txt`

**Frontend won't start:**
- Make sure Node 18+ is installed: `node --version`
- Delete `node_modules` and run `npm install` again

**Sage not responding:**
- Check your `GROQ_API_KEY` in `.env`
- Sage will still work with fallback responses if API key is missing

**Chat says "session limit reached":**
- Basic plan is limited to 10 sessions/month
- Upgrade on the Pricing page

---

## 📋 Legal & Compliance

- ✅ DISHA Guidelines compliant
- ✅ Disclaimer on every page
- ✅ Crisis helplines always visible
- ✅ No selling of user data
- ✅ Data encryption for sensitive fields
- ✅ 7-day money-back guarantee

---

*Built with ❤️ for mental wellness. Remember: seeking help is a sign of strength.*
