# Builder stage
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY weather-api-module/package*.json ./weather-api-module/

COPY . .

WORKDIR /app/weather-api-module
RUN npm ci --ignore-scripts && \
    npm run build

# Production
FROM node:18-alpine AS prod
ENV NODE_ENV prod

USER root
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 weather

# Set install apk
RUN apk add --no-cache libc6-compat && \
    apk update && \
    apk add --no-cache --update curl && \
    rm -rf /var/cache/apk/*

## Set the timezone in Seoul
RUN apk --no-cache add tzdata && \
    cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    echo "Asia/Seoul" > /etc/timezone

COPY --from=builder --chown=weather:nodejs /app/weather-api-module/dist ./dist
COPY --from=builder --chown=weather:nodejs /app/weather-api-module/node_modules ./node_modules

USER weather

CMD [ "node", "dist/main.js" ]
