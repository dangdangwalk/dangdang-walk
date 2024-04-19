# Development
FROM node:18-alpine AS dev

RUN apk add --no-cache libc6-compat && \
    apk update && \
    apk add --update curl && \
    rm -rf /var/cache/apk/*

USER root
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

COPY --chown=nestjs:nodejs . .

RUN npm ci && npm cache clean --force

HEALTHCHECK --interval=5s \
  CMD curl --fail http://localhost:3333/health || exit 1

USER nestjs

# Production Build
FROM node:18-alpine AS build

ENV NODE_ENV prod

RUN apk add --no-cache libc6-compat && \
    apk update && \
    apk add --update curl && \
    rm -rf /var/cache/apk/*

USER root
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

COPY --chown=node:node --from=dev /app/node_modules /app/node_modules

COPY --chown=nestjs:nodejs . .

RUN npm run build && \
    npm ci --omit=dev && \
    npm cache clean --force

USER nestjs

# Production Server
FROM node:18-alpine AS prod

ENV NODE_ENV prod

RUN apk add --no-cache libc6-compat && \
    apk update && \
    apk add --update curl && \
    rm -rf /var/cache/apk/*

USER root
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

COPY --chown=nestjs:nodejs --from=build /app/dist /app/dist
COPY --chown=nestjs:nodejs --from=build /app/node_modules /app/node_modules

USER nestjs

HEALTHCHECK CMD curl --fail http://localhost:8888/health || exit 1
CMD [ "node", "dist/main.js" ]
