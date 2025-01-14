# Builder stage
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY server/package*.json ./server/

COPY . .

WORKDIR /app/server
RUN npm ci --ignore-scripts && \
    npm run build

# Production
FROM node:18-alpine AS prod
ENV NODE_ENV prod

USER root
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

RUN apk add --no-cache libc6-compat && \
    apk update && \
    apk add --update curl && \
    rm -rf /var/cache/apk/*

RUN apk add --no-cache tzdata && \
    ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    echo "Asia/Seoul" > /etc/timezone

COPY --from=builder --chown=nestjs:nodejs /app/server/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/server/node_modules ./node_modules

USER nestjs

CMD ["node", "dist/main.js"]
