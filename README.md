# 🦉 Owlington

**IELTS prep for night owls.** Owlington is a cosy, moonlit place to prepare for the three IELTS skills,
**Reading**, **Listening** and **Writing**, with video lectures from real teachers and a pixel-art forest that
makes studying feel like an adventure.

![Owlington landing page](docs/screenshots/landing.png)

## What's built so far

| Area | Status |
| --- | --- |
| **Landing page**: night-sky hero, interactive owl mascot (eyes follow your cursor, it blinks and hoots when clicked), skill cards, how-it-works, student/teacher “doors” with a live preview of the student world | ✅ |
| **Sign up / log in**: choose **Student** or **Teacher** at registration; each role gets its own dashboard | ✅ (temporary, browser-only auth, see below) |
| **Student dashboard**: full-screen animated pixel night (see below) with a HUD on top: `READING` · `LISTENING` · `WRITING` tabs and the student's avatar on the right | ✅ |
| Reading / Listening / Writing **video lecture pages** | 🟡 placeholder, to be designed next |
| **Student profile** (opened from the avatar) | 🟡 placeholder |
| **Teacher dashboard** | 🟡 placeholder |

![Student dashboard](docs/screenshots/student-dashboard.png)

### The pixel night

The student dashboard background is drawn live on a `<canvas>` at a low “virtual” resolution and scaled up with
`image-rendering: pixelated`, so every pixel is a crisp square. All of it is generated from a fixed seed in
[`src/scene/NightSceneEngine.ts`](src/scene/NightSceneEngine.ts):

- a big, deep sky full of **twinkling stars** and a dithered **Milky Way**
- **falling stars** streaking across every few seconds
- a **huge moon rising on the horizon** with craters, maria and a glowing halo
- layered hills, drifting clouds and valley mist
- **swaying pine trees** and a big moonlit oak that drops the odd leaf
- **the owl** perched on the oak's branch: it blinks, looks around, and hoots (with music notes) when you click it.
  On the dashboard it also talks to you in an RPG-style dialog box with IELTS tips.
- fireflies drifting over the meadow

It pauses when it's off-screen and respects `prefers-reduced-motion`.

## Tech stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) + [Vite](https://vite.dev)
- [React Router](https://reactrouter.com) for pages and role-based route guards
- Plain CSS (one stylesheet per page/component) with design tokens in [`src/index.css`](src/index.css)
- Self-hosted fonts via Fontsource: **Fraunces** (display), **Manrope** (body), **Press Start 2P** and
  **Pixelify Sans** (pixel UI)
- No image assets: the owl mascot is hand-written SVG, and all pixel art is defined as text sprites in
  [`src/scene/sprites.ts`](src/scene/sprites.ts)

## Getting started

Requires **Node.js 20.19+** (or 22.12+).

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Type-check and build for production into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Type-check only |
| `npm run lint` | Lint with oxlint |

Try it: open the site → **Get started** → pick **Student** → you land in the forest. Click the owl!

## Project structure

```
src/
├── App.tsx                  # routes
├── index.css                # design tokens, buttons, pixel panels
├── auth/                    # AuthProvider, useAuth(), <RequireRole>, temporary mock API
├── components/
│   ├── NightScene.tsx       # React wrapper around the canvas engine
│   ├── OwlMascot.tsx        # the vector owl from the landing page
│   ├── PixelSprite.tsx      # renders text sprites as crisp SVG
│   └── Avatar.tsx           # every student is an owlet
├── data/sections.ts         # Reading / Listening / Writing: copy, colours, real test format
├── scene/
│   ├── NightSceneEngine.ts  # the procedural, animated pixel night
│   ├── sprites.ts           # owl + icon pixel art
│   └── random.ts            # seeded RNG and value noise
└── pages/
    ├── landing/             # marketing page
    ├── auth/                # register (student/teacher) + login
    ├── student/             # layout + HUD, owl dialog, section pages, profile
    ├── teacher/             # teacher dashboard (placeholder)
    └── NotFound.tsx
```

### Routes

| Path | Who | Page |
| --- | --- | --- |
| `/` | everyone | Landing |
| `/register?role=student\|teacher` | everyone | Sign up |
| `/login` | everyone | Log in |
| `/student` | students | Dashboard (pixel night) |
| `/student/reading`, `/listening`, `/writing` | students | Video lectures (placeholder) |
| `/student/profile` | students | Profile (placeholder) |
| `/teacher` | teachers | Teacher dashboard (placeholder) |

## ⚠️ About authentication (temporary)

There is **no backend yet**. Accounts are stored in the browser's `localStorage` by
[`src/auth/mockAuthApi.ts`](src/auth/mockAuthApi.ts) so the product can be clicked through end-to-end. This is
**not secure** and every browser has its own separate set of accounts. When the backend exists, replace the
functions in that one file with API calls. The rest of the app only talks to `AuthProvider`.

## Deploying

It's a static single-page app: deploy the `dist/` folder anywhere (Vercel, Netlify, Cloudflare Pages, GitHub
Pages…). Configure the host to serve `index.html` for unknown paths so routes like `/student` work on refresh.

## Roadmap

- [ ] Design the video lecture pages for Reading, Listening and Writing, and add lectures
- [ ] Design the student profile page (progress, target band, saved lectures, settings)
- [ ] Design the teacher dashboard (upload lectures, organise courses, see students)
- [ ] Real backend: accounts, sessions, video storage
- [ ] Practice tasks and writing feedback
