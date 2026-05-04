FROM node:24.14-slim AS builder

ARG LISTLESS_VERSION
RUN test -n "$LISTLESS_VERSION" || (echo "Must provide --build-arg LISTLESS_VERSION=something" && false)

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN LISTLESS_VERSION=$LISTLESS_VERSION npm run build

FROM node:24.14-slim
WORKDIR /app
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/src/listless/db/migrations ./src/listless/db/migrations

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
