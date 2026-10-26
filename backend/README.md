# Sura Study API (Flask)

The API is a Flask application using SQLAlchemy with Neon PostgreSQL. Prisma owns the database schema in `prisma/schema.prisma` and the versioned migrations. React talks to Flask over the API and never connects directly to Neon. Prisma Client is JavaScript-only and is used for migrations and the optional seed command; Flask uses SQLAlchemy to read and write the same schema.

## Neon project

The application is being set up with Neon organization `org-proud-moon-14995643` and project `square-cherry-77129647` (`examhub`, AWS `us-east-2`). Use the `development` branch for local development; keep the existing `production` branch for production data. The development branch uses the `neondb` database and `neondb_owner` role.

In the Neon Console, open the `development` branch's **Connect** panel and copy both connection strings into `backend/.env`:

- Use the **pooled** connection string for `DATABASE_URL` (Flask and Prisma Client).
- Use the **direct**, unpooled connection string for `DIRECT_URL` (Prisma migrations).
- Keep `sslmode=require` in both URLs. Do not paste connection strings into source files, frontend configuration, or chat.

## Requirements

- Python 3.10 or later
- Node.js 20 or later and npm (for Prisma schema and migrations)
- Neon PostgreSQL (or another PostgreSQL database)
- A Gemini API key for AI chat

## Local setup

From the repository root:

```sh
cd backend
python3 -m venv venv
source venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
test -f .env || cp .env.example .env
npm install
```

If you just copied `.env.example`, edit `.env` and set:

- `DATABASE_URL`: your Neon pooled connection URL, with `sslmode=require` (used by Flask and Prisma Client)
- `DIRECT_URL`: your Neon direct, unpooled connection URL, with `sslmode=require` (used by Prisma migrations)
- `COMPANY_ID`: the UUID for the Sura Study company
- `STUDENT_SESSION_SECRET`: a random secret with at least 32 characters
- `GEMINI_API_KEY`: your private Google AI Studio key
- `ADMIN_EMAIL` and `ADMIN_PASSWORD`: the admin portal credentials
- `CHAPA_ENV`: `test` while using Chapa test credentials; change to `live` only when ready
- `CHAPA_SECRET_KEY`: private secret key from the matching Chapa environment
- `CHAPA_AMOUNT`: monthly plan price in ETB (currently set to `200`)
- `APP_BASE_URL`: frontend origin used for payment return and callback URLs

Never put backend credentials in frontend files or commit `.env`.

### Chapa test payments

The student app sends checkout requests to the backend. Keep the Chapa secret key server-side in `backend/.env`; never add it to a frontend variable or share it in chat. Start with a test key from the Chapa dashboard:

```dotenv
CHAPA_ENV="test"
CHAPA_SECRET_KEY="your-private-test-secret"
CHAPA_AMOUNT="200"
APP_BASE_URL="http://localhost:5173"
```

Restart the backend after changing `.env`. The app sends the student to Chapa-hosted checkout, then verifies the transaction with Chapa's API before activating the one-month subscription. The backend checks the transaction reference, status, amount, and ETB currency; the return URL alone never grants access. Preview accounts cannot purchase plans. In production, set `CHAPA_ENV="live"`, use the live secret key, and set `APP_BASE_URL` to the public HTTPS frontend origin. The backend's public callback also verifies with Chapa before activating access.

The current checkout requests an email for Chapa's receipt; the account itself continues to use phone sign-in. Until a secret key is set, the app displays a setup notice and disables the payment button. Do not use a test key for live charges.

Check the database target before applying migrations. With the `development` branch URLs in `.env`, validate the Prisma schema and migration status:

```sh
npm run prisma:validate
npm run prisma:status
```

The Neon development branch starts without application tables. Apply the checked-in migrations and add the starter catalog:

```sh
npm run db:migrate
npm run db:seed
```

`db:migrate` runs Prisma's `migrate deploy` against `DIRECT_URL`; it applies only migrations not already recorded in Prisma's `_prisma_migrations` table. Never run migrations against the production branch until they have been tested in development. If you connect to an existing database that already has these tables but no Prisma migration history, do not run `db:migrate`: verify the schema against the checked-in migrations and baseline only after you have confirmed it is safe. `npm run db:seed` is repeatable and upserts the starter company, universities, and courses.

## Run locally

```sh
cd backend
source venv/bin/activate
flask --app app run --debug --host 127.0.0.1 --port 3001
```

Check the API with `curl http://127.0.0.1:3001/api/health`. In another terminal, run the frontend:

```sh
cd frontend
npm install
npm run dev
```

Vite proxies `/api` requests to the Flask server. Open the local URL printed by Vite.

## Production server

Do not use Flask's development server or `--debug` in production. On a Linux production host, install `requirements.txt`, provide secrets through the host's environment/secret manager, set `NODE_ENV=production` and `DEMO_STUDENT_ENABLED=false`, then start Gunicorn from `backend/`:

```sh
gunicorn --workers 2 --bind "0.0.0.0:${PORT:-3001}" \
  --access-logfile - --error-logfile - app:app
```

Set `PORT` to the port supplied by your hosting platform. Keep `DATABASE_URL`, `DIRECT_URL`, `STUDENT_SESSION_SECRET`, `ADMIN_PASSWORD`, and `GEMINI_API_KEY` server-side; do not expose them to Vite or the browser. Run `npm run db:migrate` as a deployment/release step before starting new application code.

## Demo account

For a local preview, set `DEMO_STUDENT_ENABLED="true"` in `backend/.env`. The login page displays **Preview the student space**. The demo endpoint is disabled whenever `FLASK_ENV` or `NODE_ENV` is `production`; set this flag to `false` in deployed environments. The demo account uses sample study content and does not represent a real phone number.

## Admin content

Open `/#admin` and sign in with `ADMIN_EMAIL` and `ADMIN_PASSWORD`. Admins can add universities and courses, create question banks, short notes, and books, revise content, and publish or unpublish materials. Content is split into searchable excerpts; reviewed, published excerpts are used by the paid course tutor.

## AI behavior

`POST /api/ai/public-chat` answers questions about Sura Study only. It does not retrieve student course material.

`POST /api/ai/chat` requires a student session and a university/course selection. Without an active subscription it answers only from the built-in sample notes. With an active subscription it retrieves excerpts from published material in that selected course. Both routes use the Gemini API key on the server and return clear errors if the provider is unavailable.

## API endpoints

- `GET /api/health`
- `GET /api/catalog`
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`
- `POST /api/auth/demo`, `GET /api/auth/demo/status`
- `GET /api/payments/chapa/config`
- `POST /api/payments/chapa/initialize`, `POST /api/payments/chapa/verify`
- `GET/POST /api/payments/chapa/callback`
- `POST /api/admin/login`, `GET /api/admin/me`, `POST /api/admin/logout`
- `GET /api/admin/overview`, `/api/admin/catalog`, `/api/admin/students`
- `POST /api/admin/universities`, `POST /api/admin/universities/<id>/courses`
- `POST /api/admin/materials`, `GET/PATCH/DELETE /api/admin/materials/<id>`
- `POST /api/ai/public-chat`, `POST /api/ai/chat`

## Database ownership and changes

Keep schema changes in `prisma/schema.prisma`. Create a migration from the backend directory with `npx prisma migrate dev --name describe_change` using a development database, review the generated SQL, and commit both the schema and migration. Deploy committed migrations with `npm run db:migrate`. Never run `prisma db push` against production; it bypasses migration history. React only calls Flask endpoints, and database credentials stay in the backend environment.
