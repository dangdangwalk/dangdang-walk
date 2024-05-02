FROM node:18-alpine AS base

FROM base AS prod

RUN apk add --no-cache libc6-compat && \
    apk update && \
    apk add --no-cache --update curl && \
    rm -rf /var/cache/apk/*

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 react

WORKDIR /app

USER root

RUN npm install -g serve

COPY --chown=react:nodejs build ./build
COPY --chown=react:nodejs docker-entrypoint.sh /usr/local/bin/

HEALTHCHECK CMD curl --fail http://localhost:3000/health || exit 1

RUN chmod u+x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]

USER react
