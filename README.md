
# Distributed Task Management System (Pro)

**Full-stack task manager** with realtime updates, JWT auth, and RBAC.
- Backend: Node.js, Express, MongoDB (Mongoose), Redis (ioredis), Socket.IO
- Frontend: React + Redux (via CDN), WebSocket client
- Auth: JWT (HS256), roles: `admin` and `user`
- Tests: Jest + Supertest
- Infra: Docker Compose for MongoDB + Redis

## Quick Start

### 1) Start dependencies
```bash
docker-compose up -d
```

### 2) Backend
```bash
cd backend
npm install
npm run dev   # starts on http://localhost:4000
```

### 3) Frontend
```bash
cd ../frontend
node server.js
# open http://localhost:3000
```

### Default Users (seeded)
- admin / admin  (role: admin)
- alice / alice  (role: user)

## API (selected)
- `POST /api/auth/login`  -> { token }
- `GET /api/tasks`        -> list tasks (requires JWT)
- `POST /api/tasks`       -> create task (requires JWT)
- WebSocket channel: `tasks` (server emits updates on create)

## Tests
```bash
cd backend
npm test
```

> This is a production-style **skeleton**: clean structure, tests, and realtime. Extend models, validations, and CI as needed.
