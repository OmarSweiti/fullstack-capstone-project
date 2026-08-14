# GiftLink

A full-stack MERN application that connects people giving away household items they no longer need
with people who would rather reuse than buy new. List a gift, browse what's nearby, filter by
category and condition, and message the giver.

Built as the capstone project for the **IBM Full Stack Software Developer Professional Certificate**
(Coursera).

![CI/CD](https://github.com/OmarSweiti/fullstack-capstone-project/actions/workflows/main.yml/badge.svg)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-22-5FA04E?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-6-47A248?style=flat-square&logo=mongodb&logoColor=white)

## Architecture

Three independently deployable services:

```
├── giftlink-frontend/   React 18 SPA — Bootstrap 5, React Router 6
├── giftlink-backend/    Express REST API — MongoDB, JWT auth, Pino logging
└── sentiment/           Standalone sentiment-analysis microservice for reviews
```

The frontend talks to the backend over REST. The backend delegates review sentiment scoring to the
`sentiment` service, keeping that concern out of the main API — so it can be scaled or replaced
without touching the core application.

## Tech Stack

**Frontend** — React 18 · React Router 6 · React Bootstrap · react-datepicker

**Backend** — Express 4 · MongoDB 6 (native driver) · `jsonwebtoken` · `bcryptjs` ·
`express-validator` · Pino structured logging · CORS

**Testing** — Mocha · Chai · Sinon · Supertest (backend) · React Testing Library (frontend)

**CI/CD** — GitHub Actions: JSHint linting on the backend, production build verification on the client

## Features

- **Gift listings** — post items with category, condition, and images; browse the full catalogue
- **Search & filter** — dedicated search routes with category, condition, and age filtering
- **Authentication** — JWT-based registration and login, passwords hashed with bcrypt
- **Input validation** — `express-validator` on every write path
- **Sentiment analysis** — reviews scored by a separate microservice
- **Structured logging** — Pino with pretty-printing in development

## API Routes

| Router | Responsibility |
|---|---|
| `authRoutes.js` | Registration, login, JWT issuance, profile updates |
| `giftRoutes.js` | Gift CRUD — list, detail, create |
| `searchRoutes.js` | Filtered search across the gift catalogue |

## Getting Started

**Prerequisites:** Node.js 18+, a MongoDB instance (local or Atlas)

### 1. Backend

```bash
cd giftlink-backend
npm install
cp .env.sample .env    # then fill in your own values
npm run dev
```

Required environment variables:

| Variable | Description |
|---|---|
| `MONGO_URL` | MongoDB connection string |
| `DB_NAME` | Database name |
| `JWT_SECRET` | Secret used to sign JWTs — use a long random value |

### 2. Sentiment service

```bash
cd sentiment
npm install
node index.js
```

### 3. Frontend

```bash
cd giftlink-frontend
npm install
cp .env.sample .env    # set REACT_APP_BACKEND_URL
npm start
```

The app runs on **http://localhost:3000**.

## Testing

```bash
cd giftlink-backend && npm test    # Mocha + Chai + Supertest
cd giftlink-frontend && npm test   # React Testing Library
```

## License

[Apache 2.0](LICENSE)
