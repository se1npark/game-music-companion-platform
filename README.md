# Game Music Companion Platform

Full-stack web app that recommends playlists from a player's game, mood, session style, and play context. The MVP runs with seeded data so it is easy to demo, while the architecture is shaped for Spotify, Steam, RAWG, OpenAI, and PostgreSQL/Supabase integrations.

## Why This Project

This project combines personal interest with employer-relevant engineering skills:

- Game/music domain that is easy to explain in interviews.
- React dashboard for a real user workflow instead of a static landing page.
- Node.js API with typed request validation and reusable recommendation logic.
- PostgreSQL-oriented data model for users, game libraries, tracks, playlists, service connections, and recommendations.
- External API integration plan for Spotify Web API, Steam Web API, RAWG, and AI-generated explanations.
- DevOps basics with Docker Compose, GitHub Actions, workspace scripts, and environment-based configuration.

## Features

- Session composer for prompts such as `I'm playing Valorant tonight and want dark, intense music.`
- Game-aware playlist recommendation engine using mood, game genre, time of day, session length, and intensity scoring.
- Explainable recommendation response with the matched game profile, inferred signals, track list, BPM, and reason text.
- Game library dashboard with playtime, achievements, preferred mood, and genre/mood analytics.
- Saved playlist flow that mirrors how Spotify playlist creation would work after OAuth is added.
- Service map showing whether Spotify, Steam, RAWG, OpenAI, and PostgreSQL are running in demo or configured mode.

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, Recharts, lucide-react
- Backend: Node.js, Express, TypeScript, Zod
- Database target: PostgreSQL or Supabase, modelled with Prisma schema
- AI workflow: deterministic recommendation engine now, OpenAI explanation/RAG layer planned
- External APIs: Spotify Web API, Steam Web API, RAWG API
- DevOps: Docker Compose, GitHub Actions, npm workspaces

## Repo Structure

```text
apps/
  api/              Express API, seeded data, recommendation engine, tests
  web/              React dashboard and session composer
packages/
  shared/           Shared TypeScript models
docs/               Architecture, API integration plan, portfolio notes
```

## Quick Start

```bash
npm install
npm run dev
```

The API runs on `http://localhost:4001` and the web app runs on `http://localhost:5174`.

Optional local database:

```bash
docker compose up -d postgres
```

## Useful Scripts

```bash
npm run dev        # run API and web app
npm run build      # build shared package, API, and web app
npm test           # run API tests
npm run typecheck  # run TypeScript checks
```

## Example API Request

```bash
curl -X POST http://localhost:4001/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "gameTitle": "Valorant",
    "prompt": "I am playing Valorant tonight and want dark, intense music.",
    "durationMinutes": 90
  }'
```

## Portfolio Talking Points

- Built a full-stack game and music companion platform that recommends playlists based on game genre, player mood, and session context.
- Designed a typed REST API with validation, testable recommendation logic, and PostgreSQL-ready data modelling.
- Created a React/TypeScript dashboard that visualises game library analytics, mood breakdowns, service status, and saved playlists.
- Planned production integrations with Spotify OAuth, Steam play history, RAWG game metadata, and OpenAI-generated recommendation explanations.
- Added Docker and GitHub Actions to show deployment and CI awareness.

## Next Milestones

- Add Supabase Auth or JWT auth with user-specific libraries and playlists.
- Persist recommendations and playlists with Prisma and PostgreSQL.
- Add Spotify OAuth and create playlists in a real Spotify account.
- Fetch game metadata from RAWG and Steam play history from Steam Web API.
- Add OpenAI explanations with a small RAG layer over user listening/game history.
- Deploy the API and frontend, then add screenshots and a short demo video.
