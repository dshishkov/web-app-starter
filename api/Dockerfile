FROM node:22-slim AS base
RUN corepack enable && corepack prepare pnpm@8.8.0 --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY api/package.json ./api/package.json
COPY web/package.json ./web/package.json
COPY packages/types/package.json ./packages/types/package.json
RUN pnpm install --frozen-lockfile --prod=false

COPY api/tsconfig.json ./api/tsconfig.json
COPY api/src ./api/src
COPY api/drizzle ./api/drizzle
COPY packages/types ./packages/types
RUN pnpm --filter api build
RUN pnpm prune --prod

FROM node:22-slim AS prod
ENV NODE_ENV=production
WORKDIR /app

COPY --from=base /app/api/dist ./api/dist
COPY --from=base /app/api/drizzle ./api/drizzle
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/api/node_modules ./api/node_modules
COPY --from=base /app/api/package.json ./api/package.json
COPY --from=base /app/package.json /app/pnpm-workspace.yaml ./

EXPOSE 3001
CMD ["node", "api/dist/index.js"]
