# GigLog

Private, offline-first gig diary and proof log. Capture a gig in 10-20 seconds, enrich later.

## Stack

- **Client**: React 18 + Vite + Tailwind CSS (PWA)
- **Server**: Node.js + Express REST API
- **Database**: PostgreSQL (DigitalOcean Managed)
- **Storage**: DigitalOcean Spaces (photos)
- **Hosting**: DigitalOcean App Platform

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Server
```bash
cd server
cp .env.example .env    # Edit with your DB credentials
npm install
npm run migrate         # Run database migrations
npm run dev             # Start on :8080
```

### Client
```bash
cd client
npm install
npm run dev             # Start on :5173 (proxies /api to :8080)
```

## Deployment

Configured for DigitalOcean App Platform. See `.do/app.yaml`.

1. Push to `main` branch on GitHub
2. App Platform auto-deploys
3. Set environment secrets in DO dashboard
4. Point `giglog.koti.work` DNS to the app

## License

Private — Koti Tech
