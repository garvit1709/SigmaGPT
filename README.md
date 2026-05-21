# SigmaGPT — User Manual

SigmaGPT is a full-stack AI chat app with user authentication, chat history, and subscription plans (Free, Pro, Prime).

| Part | Tech |
|------|------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | MongoDB |
| AI | OpenAI API |

---

## Table of contents

1. [Prerequisites](#1-prerequisites)
2. [Run locally](#2-run-locally)
3. [Push to GitHub](#3-push-to-github)
4. [Deploy online](#4-deploy-online)
5. [Environment variables](#5-environment-variables)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. Prerequisites

Install these before you start:

| Tool | Download |
|------|----------|
| **Node.js** (v18+) | https://nodejs.org |
| **Git** | https://git-scm.com |
| **GitHub account** | https://github.com |
| **MongoDB Atlas** (free cloud DB) | https://www.mongodb.com/cloud/atlas |
| **OpenAI API key** | https://platform.openai.com/api-keys |

---

## 2. Run locally

### Step 2.1 — Backend setup

```powershell
cd d:\SigmaGPT\Backend
npm install
```

Create `Backend/.env` (copy from `.env.example`):

```env
OPENAI_API_KEY=your_openai_api_key
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_at_least_32_characters
```

Start the backend:

```powershell
node server.js
```

You should see:

```
Connected with Database!
server running on 8080
```

### Step 2.2 — Frontend setup

Open a **second terminal**:

```powershell
cd d:\SigmaGPT\Frontend
npm install
npm run dev
```

Open the URL shown (usually **http://localhost:5173**).

### Step 2.3 — Use the app

1. Click **Sign in / Sign up** and create an account.
2. Start chatting — history is saved per user.
3. Use **Settings** or **Upgrade plan** from the profile menu (top right).

---

## 3. Push to GitHub

### Step 3.1 — Create a repository on GitHub

1. Go to https://github.com/new
2. Repository name: `SigmaGPT` (or any name you like)
3. Choose **Private** or **Public**
4. Do **not** add README, .gitignore, or license (you already have them locally)
5. Click **Create repository**

### Step 3.2 — Initialize Git and push (first time)

Run these commands in PowerShell from the project root:

```powershell
cd d:\SigmaGPT

git init
git add .
git status
```

**Important:** Confirm `.env` is **not** listed. If it appears, do not commit it — secrets must stay local.

```powershell
git commit -m "Initial commit: SigmaGPT full-stack app"

git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/SigmaGPT.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `SigmaGPT` with your GitHub username and repo name.

### Step 3.3 — Push updates later

After you change code:

```powershell
cd d:\SigmaGPT
git add .
git commit -m "Describe what you changed"
git push
```

### Security checklist before pushing

- [ ] `Backend/.env` is in `.gitignore` (never pushed)
- [ ] No API keys in source code
- [ ] `node_modules/` is ignored

---

## 4. Deploy online

Deploy **backend** and **frontend** separately. MongoDB stays on **Atlas**.

```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│   Browser   │────▶│  Frontend   │────▶│   Backend    │
│   (users)   │     │ Vercel/etc. │     │ Render/etc.  │
└─────────────┘     └─────────────┘     └──────┬───────┘
                                               │
                    ┌──────────────┐           │
                    │ MongoDB Atlas│◀──────────┘
                    └──────────────┘
```

### 4.1 — MongoDB Atlas (production)

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com).
2. Create a cluster (free tier is fine).
3. **Database Access** → add a database user (username + password).
4. **Network Access** → add IP `0.0.0.0/0` (allow from anywhere) for cloud hosting, or restrict to your host’s IPs later.
5. **Connect** → get connection string, e.g.  
   `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/sigmagpt?retryWrites=true&w=majority`

Use that as `MONGODB_URI` in production.

### 4.2 — Deploy backend (Render — free tier example)

1. Push your code to GitHub (Section 3).
2. Go to https://render.com → sign up with GitHub.
3. **New +** → **Web Service** → connect your `SigmaGPT` repo.
4. Settings:

| Setting | Value |
|---------|--------|
| **Root Directory** | `Backend` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Instance type** | Free |

5. **Environment** → add variables:

| Key | Value |
|-----|--------|
| `OPENAI_API_KEY` | your OpenAI key |
| `MONGODB_URI` | Atlas connection string |
| `JWT_SECRET` | long random string (32+ chars) |

6. Deploy. Copy your backend URL, e.g. `https://sigmagpt-api.onrender.com`.

**Note:** Free Render services sleep after inactivity; the first request may be slow.

**Alternatives:** Railway, Fly.io, Cyclic — same env vars and `node server.js`.

### 4.3 — Deploy frontend (Vercel — recommended)

1. Go to https://vercel.com → sign up with GitHub.
2. **Add New Project** → import your `SigmaGPT` repo.
3. Settings:

| Setting | Value |
|---------|--------|
| **Root Directory** | `Frontend` |
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

4. **Environment Variables**:

| Key | Value |
|-----|--------|
| `VITE_API_URL` | `https://YOUR-BACKEND-URL.onrender.com/api` |

Use your real backend URL from step 4.2 (must end with `/api`).

5. Deploy. Vercel gives you a URL like `https://sigmagpt.vercel.app`.

**Alternatives:** Netlify, Cloudflare Pages — set the same `VITE_API_URL` and build `Frontend` with `npm run build`.

### 4.4 — CORS (if the frontend cannot reach the API)

Your backend already uses `cors()`. If you get CORS errors, update `Backend/server.js` to allow your frontend URL:

```js
app.use(cors({
  origin: ["https://your-app.vercel.app", "http://localhost:5173"],
  credentials: true,
}));
```

Redeploy the backend after this change.

### 4.5 — Production checklist

- [ ] Backend live and `/api/auth/plans` returns JSON in the browser
- [ ] `VITE_API_URL` points to production backend + `/api`
- [ ] MongoDB Atlas allows connections from the host
- [ ] OpenAI key has billing/credits
- [ ] `JWT_SECRET` is strong and unique in production

---

## 5. Environment variables

### Backend (`Backend/.env`)

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key for chat replies |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for login tokens (keep private) |

### Frontend (production only)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Full API base URL, e.g. `https://api.example.com/api` |

Locally, Vite proxies `/api` to `http://localhost:8080`, so you usually do not need `VITE_API_URL` in development.

---

## 6. Troubleshooting

| Problem | Fix |
|---------|-----|
| `Failed to fetch threads` | Check MongoDB URI and Atlas network access |
| `Authentication required` | Sign in again; token may have expired |
| `Invalid or expired token` | Log out and sign in; check `JWT_SECRET` matches on server |
| Frontend cannot reach API | Set `VITE_API_URL` and check CORS on backend |
| OpenAI errors | Verify `OPENAI_API_KEY` and account credits |
| `.env` committed by mistake | Remove from Git history, rotate all secrets, add `.env` to `.gitignore` |

### Rotate secrets if `.env` was pushed

1. Regenerate OpenAI API key.
2. Change MongoDB user password.
3. Set a new `JWT_SECRET` (users will need to sign in again).

---

## Project structure

```
SigmaGPT/
├── Backend/
│   ├── server.js          # Entry point
│   ├── routes/            # API routes (auth, chat)
│   ├── models/            # User, Thread
│   ├── middleware/        # Auth, plan limits
│   └── .env.example       # Template (copy to .env)
├── Frontend/
│   ├── src/
│   │   ├── components/    # Logo, modals, auth gate
│   │   ├── api.js         # API client
│   │   └── App.jsx
│   └── public/logo.png    # Favicon
├── .gitignore
└── README.md              # This file
```

---

## Quick reference

| Task | Command |
|------|---------|
| Run backend | `cd Backend` → `node server.js` |
| Run frontend | `cd Frontend` → `npm run dev` |
| Build frontend | `cd Frontend` → `npm run build` |
| First Git push | `git init` → `git add .` → `git commit` → `git push` |

---

**By TriBrains** — SigmaGPT chat with auth, history, and Pro/Prime plans.
