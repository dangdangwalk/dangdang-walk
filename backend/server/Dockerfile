# Builder stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY . /app
COPY ./server /app/server 

WORKDIR /app/server
RUN apk add --no-cache libc6-compat && \
    apk update && \
    apk add --update curl && \
    rm -rf /var/cache/apk/*
RUN npm ci --ignore-scripts && \
    npm run build && \
    npm cache clean --force

# Production
FROM node:18-alpine AS prod 
ENV NODE_ENV prod

USER root
WORKDIR /app 
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

COPY --chown=nestjs:nodejs --from=builder /app/server/dist /app/dist
COPY --chown=nestjs:nodejs --from=builder /app/server/node_modules /app/node_modules
COPY --chown=nestjs:nodejs --from=builder /app/server/resources /app/resources

RUN if [ ! -d "/app/log" ]; then mkdir -p /app/log; fi

## Set the timezone in Seoul
RUN apk --no-cache add tzdata && \
    cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    echo "Asia/Seoul" > /etc/timezone

USER nestjs

HEALTHCHECK CMD curl --fail http://localhost:3031/health || exit 1
CMD [ "node", "dist/main.js" ]
