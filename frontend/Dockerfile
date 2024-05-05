FROM node:18-alpine AS dev

ENV NODE_ENV dev

# Set install apk
RUN apk add --no-cache libc6-compat && \
    apk update && \
    apk add --no-cache --update curl && \
    rm -rf /var/cache/apk/*

## Set the timezone in Seoul
RUN apk --no-cache add tzdata && \
    cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    echo "Asia/Seoul" > /etc/timezone

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 react

WORKDIR /app

USER root

COPY --chown=react:nodejs . .

RUN npm ci && npm cache clean --force

HEALTHCHECK CMD curl --fail http://localhost:8082/health || exit 1

USER react

FROM node:18-alpine AS build

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

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 react

WORKDIR /app

USER root

COPY --chown=react:nodejs . .

RUN npm run build:prod && \
    npm ci && \
    npm cache clean --force

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

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 react

WORKDIR /app

USER root

RUN npm install -g serve

COPY --chown=react:nodejs --from=build /app/build /app/build
COPY --chown=react:nodejs docker-entrypoint.sh /usr/local/bin/

HEALTHCHECK CMD curl --fail http://localhost:3000/health || exit 1

RUN chmod u+x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]

USER react
