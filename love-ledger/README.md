# Love Ledger

A personal relationship CRM for people who want to be intentional about the people who matter most. Track important dates, save memories, manage gift ideas, and get timely nudges to stay connected.

---

## Features

- **Relationships** — Add and manage the people in your life with contact info, love language, favorites, sizes, and notes
- **Important Dates** — Track birthdays, anniversaries, and custom events with countdown badges
- **Memory Vault** — Save and search meaningful moments, grouped by year, with full text and tag editing
- **Gift Tracker** — Kanban-style board to manage gift ideas through Idea → Saved → Purchased → Wrapped → Given
- **Thoughtfulness Engine** — Dashboard nudges for upcoming occasions, gift gaps, and people you haven't reached out to in a while
- **Log Contact** — One-click button to timestamp your last interaction with someone

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React, Vite, MUI (Material UI), React Router |
| Auth | Clerk |
| Backend | Node.js, Express |
| ORM | Prisma |
| Database | PostgreSQL (Neon) |
| Frontend Deploy | Netlify |
| Backend Deploy | Render |

---

## Local Development

### Prerequisites

- Node.js 18+
- A [Clerk](https://clerk.com) account
- A PostgreSQL database (free tier at [neon.tech](https://neon.tech))

### 1. Clone and install

```bash
git clone <repo-url>
cd love-ledger

# Install backend deps
cd backend && npm install

# Install frontend deps
cd ../frontend && npm install
```

### 2. Configure environment variables

**`backend/.env`**
```env
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
DATABASE_URL=postgresql://...?sslmode=require
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**`frontend/.env.local`**
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=
```

> Note: On macOS, port 5000 is reserved by AirPlay Receiver. Use port 4000 for the backend in local development.

### 3. Run database migrations

```bash
cd backend
npm run db:migrate
```

### 4. Start both servers

```bash
# Terminal 1 — backend (from /backend)
npm run dev

# Terminal 2 — frontend (from /frontend)
npm run dev
```

App runs at `http://localhost:3000`.

---

## Deployment

### Backend → Render

Uses `render.yaml` at the project root. Set the following environment variables in the Render dashboard:

- `CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `DATABASE_URL`
- `FRONTEND_URL` (your Netlify URL)

### Frontend → Netlify

Uses `frontend/netlify.toml`. Set in Netlify dashboard:

- `VITE_CLERK_PUBLISHABLE_KEY`
- `VITE_API_URL` (your Render backend URL, e.g. `https://love-ledger-api.onrender.com`)

---

## Project Structure

```
love-ledger/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   └── src/
│       ├── index.js             # Express app entry
│       ├── middleware/auth.js   # Clerk JWT verification
│       └── routes/              # relationships, dates, memories, gifts
├── frontend/
│   └── src/
│       ├── components/
│       │   └── AppLayout.jsx    # Sidebar + mobile nav
│       ├── pages/
│       │   ├── Dashboard.jsx    # Thoughtfulness Engine + stats
│       │   ├── Relationships.jsx
│       │   ├── RelationshipDetail.jsx
│       │   ├── MemoryVault.jsx
│       │   ├── GiftTracker.jsx
│       │   └── Settings.jsx
│       ├── lib/
│       │   ├── api.js           # Typed API client
│       │   └── utils.js         # Date helpers, normalization
│       └── theme/index.js
└── render.yaml                  # Render deploy config
```
