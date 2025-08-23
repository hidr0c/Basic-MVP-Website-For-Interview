# Basic MVP Website For Interview

Demo website
---------------
https://basic-mvp-website-for-interview.vercel.app/

Project summary
---------------
This repository is a small MVP (minimum viable product) for a teacher discovery and booking website. It contains a React + Vite frontend (TypeScript) and a sample backend in `server/` (NestJS). The app demonstrates listing teachers, filtering, a recommendation quiz, and a free trial booking modal.

Purpose
-------
This project was created as part of an internship application (internship submission / portfolio). It demonstrates frontend UI, client-side filtering and a simple backend structure using NestJS.

Big thanks
----------
Special thanks to ChatGPT for explaining the basics of NestJS and helping clarify backend concepts used in this project.

Key features
------------
- Teacher listing with avatar, rating, specialties, languages, country and price
- Search and filters: name, specialty, language, country, and price range
- Recommendation quiz (`TeacherQuiz` component) that suggests matching teachers
- Modal booking flow to choose an available slot and confirm a free trial
- Backend (NestJS) modules visible under `server/` for `auth`, `users`, `teachers`, `lessons`, `packages`, `purchases` (scaffolded controllers/services/DTOs)

What I checked and completed (Checklist)
----------------------------------------
- [x] Reviewed project structure and key frontend files (React + Vite)
- [x] Inspected `src/pages/TeachersPage.tsx` to understand filter, quiz and booking logic
- [x] Noted backend structure under `server/` (NestJS modules and controllers)
- [x] Created/updated this README with instructions, notes and checklist

Repository layout (important files)
----------------------------------
- `index.html`, `vite.config.*`, `src/` — Frontend
  - `src/main.tsx`, `src/App.tsx` — app entry
  - `src/pages/TeachersPage.tsx` — main page for teacher listing, filters and booking
  - `src/components/TeacherQuiz.tsx` — quiz component used to recommend teachers
  - `src/components/*` — shared UI components and styles
- `server/` — Backend (NestJS)
  - `server/src/` — controllers, services, modules, DTOs and schemas
- `demo-site/` — small static demo site (HTML/CSS/JS)

Run & install (Windows — cmd.exe)
---------------------------------
These commands assume you have Node.js and npm installed. Check the `package.json` files in root and `server/` for exact scripts.

1) Install frontend dependencies (root):

```cmd
cd C:\Users\Hidr0\Desktop\Basic-MVP-Website-For-Interview
npm install
```

2) Run the frontend dev server (try `dev` script):

```cmd
npm run dev
```

If there's no `dev` script, inspect `package.json` and use the correct script (for example `start`).

3) (Optional) Run the backend NestJS server to serve the API endpoints referenced in the frontend (`/api/teachers`, `/api/users`):

```cmd
cd server
npm install
npm run start:dev
```

If `start:dev` is not present in `server/package.json`, use the script that starts the NestJS app (e.g. `start`, `dev`).

Notes & assumptions
-------------------
- `TeachersPage.tsx` fetches `/api/teachers` and `/api/users` to combine profile and user data. Mock data is used if requests fail.
- Price filtering UI controls only the upper bound (`priceRange[1]`) currently.
- The README assumes typical npm scripts; open the `package.json` files if you want me to update commands exactly.


