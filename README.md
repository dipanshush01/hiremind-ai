# 🧠 HireMindAI — AI-Powered Interview Platform

A full-stack MERN platform for conducting, evaluating, and improving technical interviews using AI.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Redux Toolkit, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js, Socket.io |
| Database | MongoDB + Mongoose |
| AI | OpenAI GPT-4 Turbo |
| Storage | Cloudinary |
| Cache | Redis |
| Container | Docker + Docker Compose |

---

## 📁 Project Structure

```
hireMind/
├── client/                   # React frontend
│   └── src/
│       ├── pages/            # Public, User, Admin pages
│       ├── components/       # Reusable components
│       ├── layouts/          # Public + Dashboard layouts
│       ├── redux/            # State management
│       ├── services/         # Axios API layer
│       └── socket/           # Socket.io client
├── server/                   # Node.js backend
│   ├── controllers/          # Route handlers
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API routes
│   ├── middleware/           # Auth, uploads, errors
│   ├── services/             # AI, Email, Cloudinary
│   ├── sockets/              # Socket.io events
│   └── server.js             # Entry point
├── nginx/                    # Reverse proxy config
├── docker-compose.yml        # Multi-container setup
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)
- Redis (local or Upstash)
- OpenAI API Key
- Cloudinary account

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/hiremind-ai
cd hiremind-ai

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install
```

### 2. Configure Environment

```bash
# Copy example env file
cp server/.env.example server/.env

# Fill in your keys in server/.env:
# MONGO_URI, JWT_SECRET, OPENAI_API_KEY, CLOUDINARY_*, SMTP_*
```

### 3. Run in Development

```bash
# Terminal 1: Start backend
cd server && npm run dev

# Terminal 2: Start frontend
cd client && npm start
```

### 4. Run with Docker

```bash
# Build and start all services
docker-compose up --build

# Access at http://localhost
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| POST | `/api/auth/forgot-password` | Request reset |
| PUT | `/api/auth/reset-password/:token` | Reset password |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/update-profile` | Update profile |

### Interviews
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/interviews/start` | Start new interview |
| GET | `/api/interviews` | Get user interviews |
| GET | `/api/interviews/:id` | Get single interview |
| POST | `/api/interviews/:id/answer` | Submit answer |
| POST | `/api/interviews/:id/end` | End interview |
| POST | `/api/interviews/:id/anti-cheating` | Log cheat event |

### Resume
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/resume/upload` | Upload resume |
| POST | `/api/resume/analyze` | Analyze with AI |
| GET | `/api/resume/analysis` | Get analysis |

### Coding
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/coding/generate` | Generate problem |
| POST | `/api/coding/:id/submit` | Submit code |
| GET | `/api/coding/:id` | Get coding round |
| GET | `/api/coding/history` | Get user history |

### Analytics
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/analytics/me` | User analytics |
| GET | `/api/analytics/report` | Detailed report |
| GET | `/api/analytics/admin` | Admin overview |

---

## 🔐 Security Features
- JWT access + refresh tokens
- bcrypt password hashing
- Rate limiting (100 req/15min, 10 auth/15min)
- MongoDB injection sanitization
- XSS protection via Helmet.js
- Anti-cheating: tab switches, copy-paste, face detection

---

## 🌐 Deployment

### Frontend → Vercel
```bash
cd client && vercel --prod
```

### Backend → Railway / Render
```bash
# Push server/ folder and set environment variables
```

### Database → MongoDB Atlas
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/hiremind
```

---

## 🧠 AI Features
1. **Question Generation** — GPT-4 generates role-specific questions
2. **Answer Analysis** — Scores confidence, clarity, accuracy, grammar
3. **Resume Parsing** — Extracts skills, ATS score, weak areas
4. **Code Review** — Quality, efficiency, readability scoring
5. **Overall Feedback** — Comprehensive report with recommendations

---

## 📊 Database Schemas
- **User** — Auth, profile, skills, resume
- **Interview** — Questions, answers, AI analysis, anti-cheat flags
- **CodingRound** — Problem, submissions, test cases, AI review
- **Analytics** — Per-user aggregated performance metrics

---

## 🎨 Frontend Pages

| Page | Route | Description |
|---|---|---|
| Home | `/` | Landing page |
| Login | `/login` | Authentication |
| Register | `/register` | Sign up |
| Dashboard | `/dashboard` | Stats overview |
| Start Interview | `/dashboard/start-interview` | 3-step setup |
| Interview Session | `/dashboard/interview/:id` | Live interview |
| Interview Report | `/dashboard/interview/:id/report` | Results |
| My Interviews | `/dashboard/interviews` | History |
| Resume | `/dashboard/resume` | Upload & analysis |
| Analytics | `/dashboard/analytics` | Charts & insights |
| Coding | `/dashboard/coding` | Live coding editor |
| Settings | `/dashboard/settings` | Profile & security |
| Admin | `/admin` | Admin panel |

---

## 📄 License
MIT © 2026 HireMindAI
