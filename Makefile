
.PHONY: up backend frontend test

up:
	docker-compose up -d

backend:
	cd backend && npm install && npm run dev

frontend:
	cd frontend && node server.js

test:
	cd backend && npm test
