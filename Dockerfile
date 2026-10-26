# --- dependency stage ---
FROM oven/bun:1.4.2-alpine AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# --- build stage ---
FROM deps AS build
WORKDIR /app
COPY . .
RUN bun run build

# --- runtime stage ---
FROM deps AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Keep dev tooling: docker-compose runs TypeORM migration and ts-node seed here.
COPY --from=build /app/dist ./dist
COPY --from=build /app/src ./src
COPY --from=build /app/tsconfig*.json ./
RUN mkdir -p /app/public

EXPOSE 3000
CMD ["bun", "run", "start:prod"]
