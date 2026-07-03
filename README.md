# 🎥 Real-Time Communication & Collaboration Platform

A production-quality video conferencing and collaboration platform — inspired by Zoom, Google Meet, and Microsoft Teams. Built as an MVP-grade portfolio project demonstrating real-world full-stack engineering.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend | Node.js, Express.js, Socket.io |
| Database | MongoDB + Mongoose |
| Media | WebRTC (P2P mesh) |
| Auth | JWT (access + refresh tokens), bcrypt |
| File Uploads | Multer |
| Deployment | Vercel (client) · Render/Railway (server) · MongoDB Atlas |

## Features

- 🔐 JWT Authentication (Register / Login / Protected Routes)
- 📅 Meeting Management (Create / Join / Leave / End)
- 🎥 Multi-user Video Calling (WebRTC)
- 💬 Real-Time Chat with emoji & typing indicators
- 🖥️ Screen Sharing
- 🎨 Collaborative Whiteboard (live-sync canvas)
- 📁 File Sharing (upload / download / preview)
- 🔔 Real-Time Notifications

## Project Structure

```
├── client/   # React + Vite SPA
└── server/   # Node.js + Express API + Socket.io
```

## Getting Started

```bash
# Clone the repo
git clone <your-repo-url>

# Server
cd server && npm install
cp .env.example .env   # fill in your values
npm run dev

# Client
cd client && npm install
cp .env.example .env
npm run dev
```

## Environment Variables

See `server/.env.example` and `client/.env.example` for required configuration.

## Architecture

See `docs/ARCHITECTURE.md` (coming in Phase 15).

---

Built with ❤️ as a portfolio project — Phase 1 of 15.
