FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS dev
RUN apk add --no-cache libc6-compat && \
    apk update && \
    apk add --no-cache --update curl && \
    rm -rf /var/cache/apk/*

USER root
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Install dependencies based on the preferred package manager
COPY --chown=nextjs:nodejs . .

HEALTHCHECK --interval=5s \
  CMD curl --fail http://localhost:3000 || exit 1

RUN npm ci && npm cache clean --force

USER nextjs

# Rebuild the source code only when needed
FROM base AS build

ENV NODE_ENV prod

RUN apk add --no-cache libc6-compat && \
    apk update && \
    apk add --no-cache --update curl && \
    rm -rf /var/cache/apk/*

WORKDIR /app

USER root

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=dev /app/node_modules ./node_modules

COPY . .

RUN npm run build && \
    npm ci --omit=dev && \
    npm cache clean --force

USER nextjs

# Production image, copy all the files and run next
FROM base AS prod

USER root
WORKDIR /app

ENV NODE_ENV prod

RUN apk add --no-cache libc6-compat && \
    apk update && \
    apk add --update curl && \
    rm -rf /var/cache/apk/*


RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=build /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

#EXPOSE 3000
#
#ENV PORT 3000

CMD ["node", "server.js"]
