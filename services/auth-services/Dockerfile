# ---------- BASE ----------
FROM node:20-alpine AS base
RUN apk add --no-cache dumb-init
WORKDIR /app


# ---------- SHARED BUILD ----------
FROM base AS shared-builder
COPY shared/package*.json ./shared/
COPY shared ./shared
WORKDIR /app/shared
RUN npm install
RUN npm run build


# ---------- auth BUILD ----------
FROM base AS builder
WORKDIR /app

# Copy shared into node_modules
COPY --from=shared-builder /app/shared ./node_modules/@microservices-practice/shared

# Install auth dependencies
COPY services/auth-services/package*.json ./services/auth-services/
WORKDIR /app/services/auth-services

# Remove shared dependency (we copy it manually)
RUN sed -i '/"@microservices-practice\/shared":/d' package.json
RUN npm install

# Copy source
COPY services/auth-services/src ./src
COPY services/auth-services/prisma ./prisma
COPY services/auth-services/tsconfig.json ./
COPY services/auth-services/prisma.config.ts ./

# Generate Prisma client
RUN npx prisma generate

# Compile TypeScript
RUN npx tsc


# ---------- PRODUCTION ----------
FROM node:20-alpine AS production
RUN apk add --no-cache dumb-init postgresql-client wget

RUN addgroup -g 1001 -S nodejs
RUN adduser -S appuser -u 1001 -G nodejs

WORKDIR /app/services/auth-services

# Copy built service
COPY --from=builder --chown=appuser:nodejs /app/services/auth-services ./

# Copy shared module
COPY --from=builder \
  --chown=appuser:nodejs \
  /app/node_modules/@microservices-practice/shared \
  ./node_modules/@microservices-practice/shared

# Entrypoint
COPY services/auth-services/docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

USER appuser
EXPOSE 3001

ENTRYPOINT ["dumb-init", "--"]
CMD ["./docker-entrypoint.sh"]



