# Builder stage
FROM node:18-alpine AS builder
WORKDIR /backend
COPY . .
WORKDIR /backend/server
RUN apk add --no-cache libc6-compat curl && \
    apk update && \
    rm -rf /var/cache/apk/*
RUN npm ci && npm run build

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

COPY --chown=nestjs:nodejs --from=builder /backend/server .
COPY --chown=nestjs:nodejs --from=builder /backend/server .

RUN npm ci && npm cache clean --force

HEALTHCHECK CMD curl --fail http://localhost:3333/health || exit 1

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
COPY --chown=nestjs:nodejs --from=builder /backend/server .
COPY --chown=nestjs:nodejs --from=builder /backend/tsconfig.json /app/


# Debug information
RUN echo "Current working directory:" && pwd && \
    echo "Contents of current directory:" && ls -la && \
    echo "Contents of parent directory:" && ls -la ..

RUN if [ ! -d "/app/log" ]; then mkdir -p /app/log; fi && \
    npm run build && \
    npm ci --ignore-scripts --omit=dev && \
    npm cache clean --force

USER nestjs

# Production Server
FROM node:18-alpine AS prod

ENV NODE_ENV prod

# Set install apk
RUN apk add --no-cache libc6-compat && \
    apk update && \
    apk add --no-cache --update curl && \
    rm -rf /var/cache/apk/*

## Set the timezone in Seoul
RUN apk --no-cache add tzdata && \
    cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    echo "Asia/Seoul" > /etc/timezone

USER root
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

COPY --chown=nestjs:nodejs --from=build /app/dist /app/dist
COPY --chown=nestjs:nodejs --from=build /app/node_modules /app/node_modules
COPY --chown=nestjs:nodejs --from=build /app/log /app/log
COPY --chown=nestjs:nodejs --from=build /app/resources /app/resources

USER nestjs

HEALTHCHECK CMD curl --fail http://localhost:3031/health || exit 1
CMD [ "node", "dist/main.js" ]
