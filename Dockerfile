FROM node:20.19.5-bookworm-slim AS build

WORKDIR /app

ARG NUXT_API_PROXY_TARGET
ENV NUXT_API_PROXY_TARGET=$NUXT_API_PROXY_TARGET

RUN npm install -g pnpm@9

COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN test -n "$NUXT_API_PROXY_TARGET"
RUN pnpm build

FROM node:20.19.5-bookworm-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production

RUN apt-get update \
  && apt-get install -y --no-install-recommends curl wget \
  && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
