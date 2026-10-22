# Agent Operations Guide

This repository is designed to be agent-friendly. Use this guide whenever an automation or AI agent needs to work in the project.

## Repository Layout
- `app/`: Next.js app routes (RSC + client components).
- `components/`: Shared client components (hydration-safe).
- `levels/`: Individual level bundles. Each level folder contains `level.json`, `prompt.mdx`, and an `assets/` directory with a manifest that lists required media.
- `lib/`: Server-side helpers (database, session, storage, etc.).

## Agent Checklist
1. **Install deps** - `npm ci`.
2. **Audit deps** - `npm audit --audit-level=low` includes development and production packages.
3. **Run tests** - `npm test` (Vitest) for library coverage, or `npm run test:watch` during development.
4. **Start dev server** - `npm run dev` to boot Next.js.
5. **Build for prod** - `npm run build`.

## Testing Strategy
- GitHub Actions runs from pushes and pull requests cancel superseded validation for the same workflow and Git ref.
- Unit tests live under `tests/` and use [Vitest](https://vitest.dev/).
- CI runs the existing unit suite once with V8 coverage and retains
  `coverage/lcov.info` for seven days. Public tokenless uploads require
  `CODECOV_UPLOAD_ENABLED=true` and a push to `main`.
- Tests rely on dependency mocking (`vi.mock`) for database and filesystem calls.
- Snapshot tests are avoided; always assert explicit behaviour or payloads.
- Keep fixtures small and colocated in `tests/fixtures`.

## Level Workflow
1. Edit the target `levels/lv-xxx` folder directly (`level.json`, `prompt.mdx`, and `assets/manifest.md`).
2. Keep manifests accurate - note whether a puzzle relies on external assets or is fully self-contained.
3. Record public solving notes in `walkthroughs/lv-xxx.md`; these files are committed so maintainers can audit the intended solve path.
4. Update hashes or supporting files whenever binaries change.

## Credentials & Env
- Required env vars: `MONGODB_URI`, `SESSION_SECRET`, `PWD_PEPPER`, and `UPLOAD_DIR`.
- Never commit real secrets; use `.env.local` for local overrides.
- Tests stub out env usage, so headless agents can run them without real services.

## Deployment
- Production runs at `anubis.elfeel.me` behind the shared Caddy service.
- GitHub Actions deploys `main` only after lint, tests, and the production build pass.
- Server-only files under `deploy/.env` and `uploads/` must survive source synchronization.
- Runtime CPU, memory, and process limits belong in each service's Compose definition.

## PR Expectations
- Linting and formatting follow Next.js defaults (ESLint + Prettier). Agents should run `npm run lint` before opening a PR if changes touch JS/TS files.
- Include test results in CI or PR descriptions.
- Update this guide whenever agent workflows change.


