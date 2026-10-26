# Sura Study frontend

React 19 and Vite provide the responsive student experience, public landing page, admin portal, and AI chat interfaces. API calls use the same `/api` origin; Vite proxies them to Flask at `http://localhost:3001` during local development.

## Run the complete app

Start Flask in one terminal:

```sh
cd backend
source venv/bin/activate
flask --app app run --debug --port 3001
```

Then run the frontend in another terminal:

```sh
cd frontend
npm install
npm run dev
```

Use the local URL printed by Vite. Backend configuration and database setup are documented in [backend/README.md](../backend/README.md).

## Production build

```sh
npm run build
```

Vite writes the production assets to `dist/`.
