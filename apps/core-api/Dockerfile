# Multi-stage build
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/core-api/package.json ./apps/core-api/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY apps/core-api ./apps/core-api
COPY packages/shared ./packages/shared

# Generate Prisma client
WORKDIR /app/apps/core-api
RUN pnpm prisma generate

# Build
RUN pnpm build

# Production image
FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY --from=builder /app/apps/core-api/dist ./dist
COPY --from=builder /app/apps/core-api/node_modules ./node_modules
COPY --from=builder /app/apps/core-api/prisma ./prisma

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

CMD ["node", "dist/main"]
