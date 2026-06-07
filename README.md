# Wraith — Web Frontend

Official web platform for **Wraith**, a 2D pixel-art action game (Godot engine). The site presents the game, distributes the Windows installer, and provides an authenticated dashboard for players and administrators (profiles, news/forum, donations, and an AI support chat).

🌐 **Live:** https://wraith-web.vercel.app


---

## Tech Stack

| Area | Technology |
|------|-----------|
| Framework | [React 18](https://react.dev/) + [Vite 6](https://vitejs.dev/) |
| Routing | [react-router-dom 7](https://reactrouter.com/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) (`@tailwindcss/vite`) + scoped CSS |
| State | [Zustand 5](https://zustand-demo.pmnd.rs/) |
| HTTP | [Axios](https://axios-http.com/) |
| Forms | [react-hook-form](https://react-hook-form.com/) |
| Notifications | [react-toastify](https://fkhadra.github.io/react-toastify/) |
| Payments | [Stripe](https://stripe.com/) (`@stripe/react-stripe-js`) |
| Email | [EmailJS](https://www.emailjs.com/) (`@emailjs/browser`) |
| Realtime | [socket.io-client](https://socket.io/) (support chat) |
| Animation | [GSAP](https://gsap.com/) |
| 3D / WebGL | [three](https://threejs.org/) + [ogl](https://github.com/oframe/ogl) (animated backgrounds) |
| Auth tokens | [jwt-decode](https://github.com/auth0/jwt-decode) |
| Icons | [react-icons](https://react-icons.github.io/react-icons/) + [lucide-react](https://lucide.dev/) |
| Document parsing | [mammoth](https://github.com/mwilliamson/mammoth.js) (`.docx` → HTML for news) |

Backend API is consumed over REST (default `https://tesis-juego.onrender.com/api`); see [`src/config/api.js`](src/config/api.js).

---

## Features

- **Marketing site** — Home, game guide, environment showcase, news, donations, support.
- **Authentication** — player and administrator login, registration, email confirmation, and password recovery. Google OAuth callback supported.
- **Role-based dashboard** — `jugador` (player) and `administrador` (admin) roles; admin-only actions are gated by `PrivateRouteWithRole`.
- **News / forum** — admins publish posts (with file uploads parsed via `mammoth`); players read them.
- **Donations** — Stripe-powered payment flow with a donations table.
- **AI support chat** — realtime chat backed by `socket.io` and an AI helper (`consultarIA`).
- **Installer distribution** — the Windows installer is served as a static asset and downloaded from the `/juego` page (gated to logged-in users).

---

## Project Structure

```
src/
├── App.jsx              # Route tree (public + /dashboard/*)
├── main.jsx            # React entry point
├── index.css           # Global styles, font imports, scrollbars, keyframes
├── config/api.js       # API base URL + endpoint map
├── pages/              # Route-level screens
├── components/         # Reusable UI, grouped by domain
├── context/            # Zustand stores + auth callback
├── routes/             # Route guards
├── layout/             # Dashboard shell
├── helpers/            # useAppLink, consultarIA
├── hooks/              # useFetch
└── services/           # noticias-api
public/
└── downloads/Wraith-Installer.exe   # served at /downloads/...
```

### Pages (`src/pages/`)

| Page | Route | Purpose |
|------|-------|---------|
| `Home` | `/` | Landing page |
| `Ambiente` | `/ambiente` | Game world / environment showcase |
| `Juego` | `/juego` | Player guide + **installer download** |
| `Noticias` | `/noticias` | News / forum feed |
| `Donaciones` | `/donaciones` | Donations + Stripe checkout |
| `Asistencia` | `/asistencia` | Support form (EmailJS) + FAQs |
| `Login` | `/login` | Player / admin login *(guest-only)* |
| `Register` | `/register` | Registration *(guest-only)* |
| `Forgot` | `/forgot/:id` | Request password reset *(guest-only)* |
| `Reset` | `/reset/:token` | Set new password *(guest-only)* |
| `Confirm` | `/confirmar/:token` | Email confirmation *(guest-only)* |
| `Profile` | `/dashboard` | User profile *(protected)* |
| `List` | `/dashboard/listar` | Player list *(protected)* |
| `Details` | `/dashboard/visualizar/:id` | Player detail *(protected)* |
| `Create` | `/dashboard/crear` | Create record *(admin only)* |
| `Update` | `/dashboard/actualizar/:id` | Edit record *(admin only)* |
| `Chat` | `/dashboard/chat` | AI support chat *(protected)* |
| `NotFound` | `*` | 404 fallback |
| `Forbidden` | — | 403 screen |

Helper: `ScrollToTopButton.jsx`.

### Components (`src/components/`)

- **`principal/`** — site-wide UI and React-Bits-style effects: `Header`, `Footer`, `CardSwap`, `GooeyNav`, `LogoLoop`, `MagicBento`, `ScrollPergamino`, `TargetCursor`.
- **`backgrounds/`** — animated WebGL / canvas backgrounds: `Cubes`, `FaultyTerminal`, `PixelCard`, `PixelSnow`, `ShapeGrid`.
- **`auth/`** — `AuthShell`: shared layout + design system for all auth pages.
- **`noticias/`** — forum/news: `admin-forum-panel`, `border-glow-card`, `BorderGlow`, `confirm-delete-noticia-modal`, `glare-hover-button`, `shuffle-noticias-title`, plus `forum-db` and `forum-sanitize` helpers.
- **`donaciones/`** — `DonationsTable`, `Table`, `Modal`, `ModalPayment`, `storeDonations`.
- **`list/`** — `Table`, `EditPlayerModal`, `ConfirmDeletePlayerModal`.
- **`profile/`** — `CardProfile`, `CardProfileOwner`, `CardPassword`, `FormProfile`, `ConfirmDeleteAccountModal`.
- **`create/`** — `Form`.

### State, guards & services

- **Stores (`context/`)** — `storeAuth` (token/session), `storeProfile` (user + role), `storeDonations`; `AuthCallBack` handles OAuth redirect.
- **Guards (`routes/`)** — `PublicRoute` (guest-only, redirects authenticated users to `/dashboard`), `ProtectedRoute` (requires session), `PrivateRouteWithRole` (admin-only).
- **Helpers / hooks** — `useAppLink` (prefixes `/dashboard` for authenticated navigation), `consultarIA` (AI chat helper), `useFetch`.
- **Services** — `noticias-api` (news CRUD against the backend).

---

## Design System & Styles

Retro **pixel-art** aesthetic over a **dark monochrome** palette.

- **Theme** — black/grey gradients (`#050505 → #101010`) with subtle radial highlights; custom black scrollbars (`index.css`).
- **Typography** — loaded globally via Google Fonts in `index.css`:
  - `Press Start 2P` — pixel headings / buttons
  - `VT323` — pixel body / labels
  - `Roboto` — default body text
  - `Bungee`, `Lato` — accents
- **Auth pages** — unified through `AuthShell` using a `wr-*` class system (`wr-field`, `wr-auth-btn`, `wr-stagger`, …) with animated backgrounds (PixelSnow, scanlines, grid overlay) and staggered entrance animations.
- **Per-page styles** — page-scoped `<style>` blocks with namespaced prefixes (e.g. `jg-*` in `Juego.jsx`) keep complex layouts isolated.
- **Utilities** — Tailwind CSS 4 utility classes for layout/spacing across the app.
- **Animation** — GSAP for component motion (`CardSwap`, `GooeyNav`, etc.) plus CSS `@keyframes` (e.g. `forum-modal-in`). Respects `prefers-reduced-motion`.

---

## Routing Model

Routes are exposed in **two contexts** (see [`src/App.jsx`](src/App.jsx)):

1. **Public** — content pages reachable with or without a session (`/`, `/juego`, `/noticias`, …).
2. **Dashboard** — the same content plus admin tools under `/dashboard/*`, wrapped in `ProtectedRoute` and the `Dashboard` layout.

`useAppLink` rewrites navigation targets to stay inside `/dashboard` while authenticated, so logged-in users don't get bounced back to the dashboard root. SPA deep links (`/login`, `/register`, …) are handled by the Vercel rewrite in `vercel.json`.

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- npm

### Install
```bash
npm install
```

### Environment
Copy the template and fill in your values:
```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `VITE_BACKEND_URL` | REST API base URL |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe publishable key (donations) |
| `VITE_HUGGINGFACE_API_KEY` | AI chat model key |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service id (support form) |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template id |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public key |

> `.env` is git-ignored. In production these are configured as Vercel **Environment Variables** — without them, email/Stripe/AI/backend features fail (the static installer download still works).

### Develop
```bash
npm run dev
```

### Build / Preview
```bash
npm run build     # outputs to dist/
npm run preview   # serve the production build locally
```

### Lint
```bash
npm run lint
```

---

## Deployment

Hosted on **Vercel**, connected to this GitHub repository — every push to `main` triggers an automatic production deploy.

- **Framework preset:** Vite (`vite build` → `dist/`)
- **SPA fallback:** `vercel.json` rewrites all non-file routes to `/index.html`
- **Static installer:** `public/downloads/Wraith-Installer.exe` is served at `/downloads/Wraith-Installer.exe` directly from the filesystem (the SPA rewrite does not intercept it)

> The installer is ~30 MB. On the Vercel Hobby tier (100 GB/month bandwidth) that allows roughly 3,400 downloads/month. For higher volume, host the binary on GitHub Releases or object storage and link to it.

---

## Scripts

| Script | Action |
|--------|--------|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
