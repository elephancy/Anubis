# Anubis

An analog horror ARG built as a Next.js browser-riddle platform with hand-authored puzzle levels.

Players sign in, solve the current file, and unlock the next one in sequence. Levels live under `levels/lv-XXX` as hand-written `level.json`, `prompt.mdx`, and optional `assets/` files.

## Stack

- Next.js 16 app router
- React 19
- MongoDB for users, sessions, progress, and leaderboard data
- Local filesystem storage for profile images and GIF avatars
- Local level files served by the app
- Docker-ready production build

## Local Development

```bash
npm install
npm run dev
```

The dev server runs on `http://localhost:3000`.

Required `.env.local` values:

```ini
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
SESSION_SECRET=dev-session-secret
PWD_PEPPER=dev-pepper
UPLOAD_DIR=.data/uploads
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local Next.js dev server. |
| `npm run build` | Create a production build. |
| `npm run start` | Start the production server after build. |
| `npm run lint` | Run ESLint. |
| `npm test` | Run Vitest. |

## Level Authoring

Each playable level is manually maintained:

```text
levels/lv-001/
  level.json
  prompt.mdx
  assets/
    manifest.md
```

Keep committed puzzle walkthroughs in `walkthroughs/lv-XXX.md` so repository readers can audit the intended solve path.

When credentials change, update the hashes in `level.json`. Do not put plain final credential pairs in manifests or live prompts.

## Production releases

The private controller discovers reviewed `main` commits after the required CI
runs succeed and publication is approved. It owns immutable image publication,
runtime configuration, health gates, receipts, and rollback. This repository
keeps application CI and build files, without a production caller, duplicate
release manifest, or production deployment credentials.

## Independent container builds

For local or independent hosting, the app can run as a standard Next.js server or as the provided Docker service.
Create a production env file from the example, then build the container:

```bash
cp deploy/.env.example deploy/.env
nano deploy/.env
docker compose -f docker-compose.prod.yml up -d --build
```

The Docker service expects an external network named `web` and stores uploaded
profile images in the mounted `uploads/` directory.
