# Sura Study frontend

React 19 and Vite provide the responsive student experience, public landing page, admin portal, and AI chat interfaces. API calls use the same `/api` origin; Vite proxies them to Flask at `http://localhost:3001` during local development.

## Run the complete app

Start the Flask backend in one terminal. The backend must be running before using
student login, the AI tutor, payments, or the admin portal:

```sh
cd backend
# Use the backend virtual environment, not a repository-level .venv.
source venv/bin/activate
python -m pip install -r requirements.txt
flask --app app run --debug --host 127.0.0.1 --port 3001
```

Then run the frontend in another terminal:

```sh
cd frontend
npm install
npm run dev
```

Use the local URL printed by Vite. Backend configuration and database setup are documented in [backend/README.md](../backend/README.md).

## Admin portal

Open `http://localhost:5173/#admin` and sign in with the `ADMIN_EMAIL` and
`ADMIN_PASSWORD` values configured in `backend/.env`. The portal can add
universities and courses, create and edit study materials, publish or unpublish
materials, and review registered students. Never put these credentials in the
frontend or commit `backend/.env`.

## Production build

```sh
npm run build
```

Vite writes the production assets to `dist/`.
