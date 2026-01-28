# --- build stage ---
FROM node:24-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# --- runtime stage ---
FROM node:24-alpine
WORKDIR /app

COPY package*.json ./
# migrate & seed butuh devDependencies (ts-node, tsconfig-paths, typeorm-ts-node-commonjs)
RUN npm install

# dist untuk start:prod
COPY --from=build /app/dist ./dist

# src untuk migrate/seed (karena migrate pakai -d src/core/data_source.ts dan seed pakai ts-node src/...)
COPY --from=build /app/src ./src
COPY --from=build /app/tsconfig*.json ./
# kalau ada file config lain yang dipakai runtime, copy juga (optional):
# COPY --from=build /app/.env ./.env   # biasanya pakai env_file jadi tidak perlu
# COPY --from=build /app/nest-cli.json ./nest-cli.json

# public untuk uploads (dipersist via volume)
RUN mkdir -p /app/public

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
