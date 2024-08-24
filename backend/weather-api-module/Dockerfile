# Builder stage
FROM node:18-alpine AS builder
WORKDIR /backend
COPY . .
WORKDIR /backend/weather-api-module
RUN apk add --no-cache libc6-compat curl && \
    apk update && \
    rm -rf /var/cache/apk/*
RUN npm ci --ignore-scripts && npm run build

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

COPY --chown=nestjs:nodejs --from=builder /backend/weather-api-module .
COPY --chown=nestjs:nodejs --from=builder /backend/weather-api-moudle .

RUN npm ci && npm cache clean --force

HEALTHCHECK CMD curl --fail http://localhost:3333/health || exit 1

USER weather 

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
    adduser --system --uid 1001 weather

COPY --chown=weather:nodejs --from=builder /backend/weather-api-module/node_modules /app/node_modules
COPY --chown=weather:nodejs --from=builder /backend/weather-api-module .
COPY --chown=weather:nodejs --from=builder /backend/tsconfig.json /app/


# Debug information
RUN echo "Current working directory:" && pwd && \
    echo "Contents of current directory:" && ls -la && \
    echo "Contents of parent directory:" && ls -la ..

RUN if [ ! -d "/app/log" ]; then mkdir -p /app/log; fi
COPY --chown=weather:nodejs --from=builder /backend/weather-api-module/dist /app/dist

RUN npm ci --ignore-scripts --omit=dev && \
    npm cache clean --force

USER weather

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
    adduser --system --uid 1001 weather

COPY --chown=weather:nodejs --from=build /app/dist /app/dist
COPY --chown=weather:nodejs --from=build /app/node_modules /app/node_modules
COPY --chown=weather:nodejs --from=build /app/log /app/log

USER weather

CMD [ "node", "dist/init.js" ]
