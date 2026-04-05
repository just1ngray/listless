FROM node:24.14-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:24.14-slim
WORKDIR /app
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/src/listless/db/migrations ./src/listless/db/migrations

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
