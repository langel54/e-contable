# Backend Node.js + Express + Prisma para AWS (App Runner / ECS)
FROM node:20-alpine AS base

WORKDIR /app

# Dependencias
FROM base AS deps
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

# Generar Prisma Client y migraciones
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY package.json ./
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=1
RUN npx prisma generate --schema=./src/models/schema.prisma

# Imagen final
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3001

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/src/models/schema.prisma ./src/models/schema.prisma

# Migraciones se ejecutan en el entrypoint o en un job aparte
RUN npx prisma generate --schema=./src/models/schema.prisma

USER expressjs

EXPOSE 3001

CMD ["node", "src/app.js"]
