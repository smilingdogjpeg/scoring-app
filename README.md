# Scoring App – Backend API

This repository contains the backend API for the Scoring App.

It provides endpoints to manage Houses, Factions, and Games, and aggregates scores across multiple games using a PostgreSQL database hosted on Supabase.

The backend is built with Node.js, Express, and Prisma, and is deployed on Render.

## Tech Stack

Node.js (ES Modules)

Express

PostgreSQL (Supabase)

Prisma ORM

Vercel (deployment)

dotenv

cors

## Data Model Overview

### House

Represents a team or unit

Has a strength and weakness (humour-based)

Has a private password for edits

Accumulates scores from multiple games

### Faction

Groups multiple houses

Provides shared identity and motto

### Game

Represents a scoring event or round

Stores scores per house per humour

### Score

Join table between House and Game

Stores humour scores for a single house in a single game

## Environment Variables

Create a .env file with the following variables:

DATABASE_URL=postgresql://user:password@host:5432/postgres

ADMIN_PASSWORD=your-admin-password

ALLOWED_ORIGINS=http://localhost:5173,https://your-frontend-domain

PORT=3000

**Notes:**

DATABASE_URL should use the Supabase Session Pooler URL when deployed (IPv4 compatible)

ADMIN_PASSWORD must never be committed

ALLOWED_ORIGINS should be a comma-separated list of frontend URLs

## Running Locally

Install dependencies
npm install

Generate Prisma client
npx prisma generate

Run migrations
npx prisma migrate dev

Start the server
npm run dev

The server will run at:
http://localhost:3000

## Base URL (Production)

https://YOUR-RENDER-APP.onrender.com

All endpoints are prefixed with:

/api

## API Endpoints

### Houses

GET /api/houses
Returns all houses with aggregated scores.

GET /api/houses/:id
Returns a single house.

POST /api/houses
Creates a new house.

**Required body fields:**

name

motto

strength

weakness

password

**Optional:**

crestUrl

PATCH /api/houses/:id
Edits an existing house.

**Authorization options:**

Provide the correct house password in the request body as currentPassword

Provide the admin password in the request header

DELETE /api/houses/:id
Deletes a house.
Admin password required.

### Factions

GET /api/factions
Returns all factions.

POST /api/factions
Creates a new faction.

**Required body fields:**

name

motto

houseIds (array of house IDs)

DELETE /api/factions/:id
Deletes a faction.
Admin password required.

### Games

GET /api/games
Returns all games in chronological order.

POST /api/games
Creates a new game and assigns scores to houses.

DELETE /api/games/:id
Deletes a game entry.
Admin password required.

## Admin Password System (Temporary)

**This API uses a temporary admin-password mechanism for privileged actions such as:**

Deleting houses

Deleting factions

Deleting games

Editing houses without knowing the house password

**How it works:**

The admin password is stored in the environment variable ADMIN_PASSWORD

Requests include a header called x-admin-password

**Important notes:**

This is intended for development and prototyping only

The admin password must never be hardcoded in frontend source code

In production, this should be replaced with proper authentication (JWT, Supabase Auth, roles, etc.)

## Frontend Integration

The frontend only needs the base API URL.

Conceptually:

Base URL: https://YOUR-RENDER-APP.onrender.com

Fetch houses: GET /api/houses

## Future Improvements

Replace admin password with real authentication

Add role-based permissions

Add validation schemas

Add pagination

Add rate limiting

## License

Private project – for educational and internal use.
