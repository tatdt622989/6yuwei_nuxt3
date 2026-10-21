FROM node:26.12.1-trixie-slim@sha256:1653c74b30c27b26f68c2d21279be12139d2ba723e3a682c425ec4bfb6070422 AS build

WORKDIR /app

ARG NUXT_API_PROXY_TARGET
ENV NUXT_API_PROXY_TARGET=$NUXT_API_PROXY_TARGET

ENV NUXT_TELEMETRY_DISABLED=1
RUN npm install -g pnpm@12.14.0

COPY . .
RUN test -n "$NUXT_API_PROXY_TARGET"
RUN pnpm install --frozen-lockfile
RUN pnpm test && pnpm typecheck && pnpm build

FROM node:26.12.1-trixie-slim@sha256:1653c74b30c27b26f68c2d21279be12139d2ba723e3a682c425ec4bfb6070422 AS runtime

WORKDIR /app

ENV NODE_ENV=production
ARG SOURCE_COMMIT=unknown
LABEL org.opencontainers.image.revision=$SOURCE_COMMIT

RUN apt-get update \
  && apt-get install -y --no-install-recommends curl wget \
  && rm -rf /var/lib/apt/lists/*

COPY --from=build --chown=node:node /app/.output ./.output
USER node

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
