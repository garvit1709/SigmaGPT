# Deploy SigmaGPT (no device code)

Choose **one** way to push to GitHub, then deploy.

---

## Option A — Personal Access Token (easiest)

### 1. Create empty repo on GitHub

- Open https://github.com/new
- Name: `SigmaGPT`
- **Do not** add README / .gitignore / license
- Click **Create repository**

### 2. Create a token

- Open https://github.com/settings/tokens/new
- Note: `SigmaGPT`
- Scope: **`repo`**
- **Generate token** → copy it

### 3. Push from your PC

```powershell
cd d:\SigmaGPT
powershell -ExecutionPolicy Bypass -File scripts\push-github.ps1
```

Enter your GitHub username, repo name, and paste the token when asked.

---

## Option B — SSH key

### 1. Generate key (if you don't have one)

```powershell
ssh-keygen -t ed25519 -C "paretagarvit@gmail.com" -f "$env:USERPROFILE\.ssh\id_ed25519" -N '""'
```

### 2. Add key to GitHub

- Copy: `Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub`
- Paste at https://github.com/settings/keys → **New SSH key**

### 3. Create empty repo + push

```powershell
cd d:\SigmaGPT
powershell -ExecutionPolicy Bypass -File scripts\push-github-ssh.ps1
```

---

## Option C — GitHub Desktop

1. Install https://desktop.github.com
2. **File → Add local repository** → `d:\SigmaGPT`
3. **Publish repository** → choose name `SigmaGPT`

---

## Deploy after code is on GitHub

### Backend — Render (free)

1. https://dashboard.render.com → **Sign up with GitHub**
2. **New +** → **Blueprint** → connect `SigmaGPT` repo  
   (uses `render.yaml` in repo root)
   
   **Or** **Web Service** manually:
   - Root Directory: `Backend`
   - Build: `npm install`
   - Start: `node server.js`

3. **Environment variables:**

| Key | Value |
|-----|--------|
| `OPENAI_API_KEY` | from OpenAI |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | long random string (32+ chars) |
| `FRONTEND_URL` | *(add after frontend deploy)* |

4. Copy backend URL, e.g. `https://sigmagpt-api.onrender.com`

### Frontend — Vercel (free)

1. https://vercel.com → **Sign up with GitHub**
2. **Add New Project** → import `SigmaGPT`
3. **Root Directory:** `Frontend`
4. **Environment variable:**

| Key | Value |
|-----|--------|
| `VITE_API_URL` | `https://YOUR-BACKEND.onrender.com/api` |

5. Deploy → copy URL, e.g. `https://sigmagpt.vercel.app`

### Finish

1. In **Render**, set `FRONTEND_URL` = your Vercel URL (no trailing slash)
2. Redeploy backend if needed
3. Open Vercel URL → sign up → chat

---

## Already committed locally?

Your project is ready at `d:\SigmaGPT` with git commits on branch `main`.  
You only need to **push** using Option A, B, or C above.

```powershell
cd d:\SigmaGPT
git log --oneline -3
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `Authentication failed` | New token with `repo` scope |
| CORS error in browser | Set `FRONTEND_URL` on Render to exact Vercel URL |
| API 401 | Sign in again; check `JWT_SECRET` on Render |
| Build fails on Vercel | Root Directory must be `Frontend` |
