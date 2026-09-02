# Aquora — Frontend

A React + Vite + Tailwind frontend for the Aquora water-report backend (rooms,
peer-verified members, photo reports with room-scoped verification, and an
admin panel).

## Getting started

```bash
npm install
cp .env.example .env      # then edit VITE_API_BASE if needed
npm run dev
```

The app runs at `http://localhost:5173`.

## Camera capture

The "Log a fill" page opens the device camera in-page (`getUserMedia`) and
captures a still frame — there's no gallery/file picker, so every fill has to
be photographed live. If camera access is blocked or unsupported, it falls
back to a file input with `capture="environment"`, which still opens the
device's native camera app (never the photo library).

Browsers require a **secure context** for camera access — `https://` in
production, or `localhost` in development (which Vite's dev server already
is).

## Configuration

Set your API's base URL in `.env`:

```
VITE_API_BASE=http://localhost:5000/api
```

Make sure CORS is enabled on your Express server for whatever origin this
frontend runs on.

## Project structure

```
src/
  api/client.js          fetch wrapper used by every page
  context/
    AuthContext.jsx      login/register/logout, session persisted in localStorage
    AlertContext.jsx     toast notifications
  components/            shared UI: buttons, cards, gauge, nav, layouts
  pages/
    Landing.jsx           marketing / hero page
    Login.jsx, Register.jsx, Waiting.jsx
    app/
      AppLayout.jsx        sidebar + mobile nav shell
      Feed.jsx              verified reports for your room
      Upload.jsx            submit a new report
      PendingReports.jsx     verify/reject reports from your room
      PendingMembers.jsx    verify pending members of your room
      Admin.jsx              admin-only: all users, all pending members, all reports
```

## Build for production

```bash
npm run build
```

Outputs static files to `dist/` — deploy that folder to any static host
(Vercel, Netlify, S3, Nginx, etc.), pointing `VITE_API_BASE` at your live API
at build time.
