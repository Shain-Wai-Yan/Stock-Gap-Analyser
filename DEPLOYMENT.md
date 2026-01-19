# Deployment Guide

## Frontend Deployment (Vercel)

### 1. Deploy to Vercel

Click the button in v0 or use Vercel CLI:

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
\`\`\`

### 2. Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

- `NEXT_PUBLIC_API_URL`: Your FastAPI backend URL (leave empty for mock data)
- `NEXT_PUBLIC_WS_URL`: Your WebSocket URL (leave empty to disable)

Example:
\`\`\`
NEXT_PUBLIC_API_URL=https://your-backend.fly.dev
NEXT_PUBLIC_WS_URL=wss://your-backend.fly.dev/ws/gaps
\`\`\`

### 3. Redeploy

After adding environment variables, redeploy:

\`\`\`bash
vercel --prod
\`\`\`

---

## Backend Deployment (Fly.io)

### 1. Install Fly CLI

\`\`\`bash
curl -L https://fly.io/install.sh | sh
\`\`\`

### 2. Create FastAPI Backend

See `API_INTEGRATION.md` for complete backend code.

### 3. Deploy to Fly.io

\`\`\`bash
# Login to Fly.io
fly auth login

# Create app
fly launch

# Deploy
fly deploy
\`\`\`

### 4. Configure Secrets

\`\`\`bash
# Alpaca API Keys
fly secrets set ALPACA_API_KEY=your_key
fly secrets set ALPACA_SECRET_KEY=your_secret

# Database URL (if using Supabase/Neon)
fly secrets set DATABASE_URL=your_connection_string
\`\`\`

---

## Testing the Connection

1. Deploy frontend to Vercel
2. Deploy backend to Fly.io
3. Set environment variables in Vercel
4. Visit your Vercel URL
5. Check footer status bar - should show "API: Connected"

---

## Troubleshooting

### Frontend shows "API Connection Error"

- Check `NEXT_PUBLIC_API_URL` is set correctly
- Ensure backend is running: `curl https://your-backend.fly.dev/api/gaps`
- Check browser console for CORS errors

### WebSocket not connecting

- Verify `NEXT_PUBLIC_WS_URL` uses `wss://` (not `ws://`) for production
- Check backend WebSocket endpoint is accessible
- Browser console will show connection status

### Mock data not showing

- If env vars are empty, app uses mock data automatically
- Check browser console for errors
- Ensure React Query provider is wrapping the app

---

## Local Development

### Frontend

\`\`\`bash
npm run dev
\`\`\`

### Backend (FastAPI)

\`\`\`bash
# Install dependencies
pip install fastapi uvicorn alpaca-py pandas vectorbt

# Run server
uvicorn main:app --reload
\`\`\`

### Connect Locally

Create `.env.local`:

\`\`\`bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws/gaps
\`\`\`

---

## Production Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Fly.io
- [ ] Environment variables configured
- [ ] Alpaca API keys set
- [ ] Database connection tested
- [ ] WebSocket connection working
- [ ] Gap scanner loads data
- [ ] Charts display correctly
- [ ] Command palette works (⌘K)
- [ ] Mobile responsive
