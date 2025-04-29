FROM node:18-alpine AS base

WORKDIR /app

FROM base AS deps
COPY ./applications/webapp/package.json ./applications/webapp/package-lock.json* ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY ./applications/webapp .

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

RUN ls -l && npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

ENV PORT 3000
ENV API_URL http://localhost:5000/api

EXPOSE 3000

ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]