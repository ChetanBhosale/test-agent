# Deployment guide

This project is a static Next.js 16 app with no backend dependencies, so
deployment is fast and free on Vercel.

---

## 1. Push to GitHub

```bash
# From the project root
git init                                        # already initialized
git add .
git commit -m "feat: production-ready Riverline app"

# Option A — new repo named "riverline-app"
gh repo create riverline-app --public --source=. --remote=origin --push

# Option B — manually create the repo on github.com first, then:
git remote add origin https://github.com/<your-username>/riverline-app.git
git branch -M main
git push -u origin main
```

If you have an existing remote pointing somewhere else, update it first:

```bash
git remote set-url origin https://github.com/<your-username>/riverline-app.git
git push -u origin main
```

---

## 2. Deploy to Vercel

### Easiest path — Vercel dashboard

1. Open [vercel.com/new](https://vercel.com/new).
2. Click **Import Git Repository** and pick `riverline-app`.
3. Vercel auto-detects Next.js. Keep all defaults:
   - Framework Preset: **Next.js**
   - Build Command: `next build` (default)
   - Output Directory: _leave blank_ (default)
   - Install Command: `npm install` (default)
4. Click **Deploy**.

The first deploy takes about 60 seconds. You'll get a public URL like
`https://riverline-app.vercel.app`.

### Alternative — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

Pick the existing project (or create a new one named `riverline-app`).
The first run sets it up; future runs deploy in seconds.

---

## 3. After deployment

- Automatic deployments are enabled by default. Every push to `main`
  triggers a new production deploy. Every push to other branches creates
  a preview URL.
- The public URL is shareable on mobile and desktop without any further
  config.
- No environment variables are required.

---

## 4. Common gotchas

- **Node version:** Vercel's default Node 20 works perfectly with
  Next.js 16. No override needed.
- **Build cache:** if you ever see stale builds, redeploy with
  "Redeploy without build cache" from the Vercel dashboard.
- **Custom domain:** add it under **Settings → Domains** on Vercel.
  Free with any plan.

---

## 5. Local production preview

Want to verify the production build locally before deploying?

```bash
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000) — this runs the
optimized output exactly as Vercel will serve it.
