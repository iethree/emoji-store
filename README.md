# Emoji Store

A tiny emoji shop. Browse emojis, add to cart, and pay with monopoly money.

## Stack

- Frontend: React + Vite
- Backend: Express
- Database: Postgres
- Everything runs via `docker compose`

## Running

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:4000
- Postgres: localhost:5432 (`emoji` / `emoji` / `emoji_store`)

The DB is seeded on first start from `db/init/001_schema.sql`, which includes a
demo customer (`demo@emojistore.test`) with $1000.00 in monopoly money.

## Tests

### Backend unit tests

```bash
cd backend
npm install
npm test
```

### Frontend unit tests

```bash
cd frontend
npm install
npm test
```

### Cypress e2e

The app must be running (`docker compose up`) first.

```bash
cd frontend
npm install
npm run cypress:open   # interactive
npm run cypress:run    # headless
```

## API

- `GET  /api/emojis?category=<cat>`
- `GET  /api/emojis/:id`
- `POST /api/customers` — `{ email, name }` (new customers start with $1000)
- `GET  /api/customers/:id`
- `POST /api/checkout` — `{ customer_id, items: [{ emoji_id, quantity }] }`
- `GET  /api/orders?customer_id=<id>`
- `GET  /api/orders/:id`
