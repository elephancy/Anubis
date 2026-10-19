FROM node:24-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY tools/next-eslint-glob ./tools/next-eslint-glob
RUN npm ci

FROM node:24-bookworm-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN MONGODB_URI=mongodb://127.0.0.1:27017/anubis_build \
    SESSION_SECRET=build-only-session-secret \
    PWD_PEPPER=build-only-password-pepper \
    UPLOAD_DIR=/tmp/anubis-uploads \
    npm run build

FROM node:24-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

COPY --chown=node:node --from=builder /app/.next/standalone ./
COPY --chown=node:node --from=builder /app/.next/static ./.next/static
COPY --chown=node:node --from=builder /app/public ./public
COPY --chown=node:node --from=builder /app/levels ./levels
RUN mkdir -p /app/uploads && chown node:node /app/uploads

EXPOSE 3000
USER node
CMD ["node", "server.js"]
