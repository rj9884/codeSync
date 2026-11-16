# CodeSync - Agent Instructions

## Project Overview
CodeSync is a real-time collaborative code editor with Spring Boot backend and React/TypeScript frontend. Uses CodeMirror 6 for editing, STOMP over WebSocket for real-time sync, and Judge0 for code execution.

## Architecture
- **Backend**: Spring Boot 3.3+, Java 21, Redis for state/pubsub
- **Frontend**: React 18 + TypeScript + Vite, CodeMirror 6, @stomp/stompjs
- **Real-time**: STOMP over WebSocket (SockJS fallback)
- **Code Execution**: Judge0 API via RapidAPI

## Development Commands
```bash
# Start all services
docker compose up -d

# Backend only
cd backend && ./mvnw spring-boot:run

# Frontend only
cd frontend && npm run dev

# View logs
docker compose logs -f backend
docker compose logs -f frontend
```

## Key Endpoints
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080/api (or via nginx at http://localhost:5173/api)
- WebSocket: ws://localhost:5173/ws
- Health: http://localhost:5173/api/actuator/health

## Testing Flow
1. Open http://localhost:5173
2. Enter room ID + name → "Join Room" OR click "Create New Room"
3. Should navigate to `/editor/{roomId}`
4. Editor loads with CodeMirror, sidebar shows users

## Common Issues
- Room creation/joining: Backend generates UUID if not provided, frontend must use returned ID
- WebSocket: Nginx proxies `/ws` → `backend:8080/api/ws`
- Judge0: Requires API keys in docker-compose for execution to work