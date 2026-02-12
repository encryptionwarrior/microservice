# FROM node:20-alpine AS base
# RUN apk add --no-cache dumb-init
# WORKDIR /app

# FROM base AS shared-builder
# COPY shared/package*.json ./shared/
# COPY shared ./shared
# WORKDIR /app/shared
# RUN npm install && npm run build

# FROM base AS builder
# WORKDIR /app

# COPY --from=shared-builder /app/shared ./node_modules/@microservices-practice/shared

# COPY services/notes-services/package*.json ./services/notes-services/
# WORKDIR /app/services/notes-services
# RUN sed -i '/"@microservices-practice\/shared":/d' package.json
# RUN npm install

# COPY services/notes-services/src ./src
# COPY services/notes-services/prisma ./prisma
# COPY services/notes-services/tsconfig.json ./

# RUN npx prisma generate
# RUN npx tsc

# FROM node:20-alpine AS production
# RUN apk add --no-cache dumb-init postgresql-client wget

# RUN addgroup -g 1001 -S nodejs
# RUN adduser -S appuser -u 1001 -G nodejs

# WORKDIR /app

# COPY services/notes-services/prisma.config.ts ./
# COPY --from=builder --chown=appuser:nodejs /app/services/notes-services/dist ./dist
# COPY --from=builder --chown=appuser:nodejs /app/services/notes-services/node_modules ./node_modules
# COPY --from=builder --chown=appuser:nodejs /app/node_modules/@microservices-practice/shared ./node_modules/@microservices-practice/shared
# COPY --from=builder --chown=appuser:nodejs /app/services/notes-services/prisma ./prisma

# COPY services/notes-services/docker-entrypoint.sh ./docker-entrypoint.sh
# RUN chmod +x ./docker-entrypoint.sh

# USER appuser
# EXPOSE 3003

# ENTRYPOINT ["dumb-init", "--"]
# CMD ["./docker-entrypoint.sh"]


# ---------- BASE ----------
FROM node:20-alpine AS base
RUN apk add --no-cache dumb-init
WORKDIR /app

# ---------- SHARED BUILD ----------
FROM base AS shared-builder
COPY shared/package*.json ./shared/
COPY shared ./shared
WORKDIR /app/shared
RUN npm install && npm run build

# ---------- NOTES BUILD ----------
FROM base AS builder
WORKDIR /app

COPY --from=shared-builder /app/shared ./node_modules/@microservices-practice/shared

COPY services/notes-services/package*.json ./services/notes-services/
WORKDIR /app/services/notes-services

RUN sed -i '/"@microservices-practice\/shared":/d' package.json
RUN npm install

COPY services/notes-services/src ./src
COPY services/notes-services/prisma ./prisma
COPY services/notes-services/tsconfig.json ./
COPY services/notes-services/prisma.config.ts ./

RUN npx prisma generate
RUN npx tsc

# ---------- PRODUCTION ----------
FROM node:20-alpine AS production
RUN apk add --no-cache dumb-init postgresql-client wget

RUN addgroup -g 1001 -S nodejs
RUN adduser -S appuser -u 1001 -G nodejs

WORKDIR /app/services/notes-services

COPY --from=builder --chown=appuser:nodejs /app/services/notes-services ./

COPY services/notes-services/docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

USER appuser
EXPOSE 3003

ENTRYPOINT ["dumb-init", "--"]
CMD ["./docker-entrypoint.sh"]


