# wtaylor.xyz — Personal Portfolio Site

[![Live Site](https://img.shields.io/badge/Live%20Site-wtaylor.xyz-blue?style=for-the-badge)](https://wtaylor.xyz)

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?logo=nginx&logoColor=white)

![Logo Gif](images/w_logo.gif)

Personal portfolio site and project playground. Built as a full-stack monorepo and self-hosted on a VPS behind Nginx.

---

## Projects

### Node Sweep

![Node Sweep](images/node-sweep.gif)

Multiplayer Battleship-style game playable in real time over WebSockets. Supports a solo mode with bot opponents that play autonomously using game logic implemented in pure Python.

### Pingboard

![Pingboard](images/pingboard.png)

Monitors a set of public API endpoints for uptime and response time. Runs scheduled health checks (APScheduler), stores results in PostgreSQL, and displays historical data with sparkline graphs.

### ShortCut

![Shortcut](images/shortcut.png)

URL shortener. Submit a long URL, get a short redirect link backed by the FastAPI backend and PostgreSQL.

### Conway's Game of Life

![Conway](images/conway.gif)

Interactive cellular automaton simulation. Start, pause, step through generations, and adjust speed — all rendered on an HTML canvas with React.

---

## Architecture

Four services orchestrated with Docker Compose:

```
Client → Nginx (port 80/443)
           ├── /*            → Next.js frontend
           ├── /api/*        → FastAPI backend
           ├── /link/*       → FastAPI backend (URL redirects)
           └── /ws/node-sweep → FastAPI backend (WebSocket)
```

- **Frontend** — Next.js 15 App Router with React 19. Server Components for data fetching; Client Components for interactive pages. CSS Modules for scoped styles.
- **Backend** — FastAPI with async request handling via `asyncpg`. APScheduler runs service health checks hourly. Served by Uvicorn.
- **Database** — PostgreSQL 15. Schema initialized via shell script on first container start; seed data populates monitored services.
- **Reverse Proxy** — Nginx handles TLS termination, HTTP→HTTPS redirect, security headers, and WebSocket proxying.

Two Docker networks keep the database internal: `backend-net` (db + backend only) and `frontend-net` (reverse-proxy, frontend, and backend).

---

## Testing

- **Frontend** — Vitest + React Testing Library. Covers component rendering, game logic, and reducer behavior. See [`frontend/__tests__/README.md`](frontend/__tests__/README.md).
- **Backend** — Pytest with an async test client. Covers API routes, game logic, and database interactions. See [`backend/tests/README.md`](backend/tests/README.md).
