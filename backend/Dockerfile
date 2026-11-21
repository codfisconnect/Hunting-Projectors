# syntax=docker/dockerfile:1
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Install OpenSSL and CA certificates for Prisma generation and HTTPS
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Copy dependency manifests and Prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies including devDependencies for build
RUN npm ci

# Generate Prisma Client (builds debian-openssl-3.0.x engine)
RUN npx prisma generate

# Copy source code and config
COPY tsconfig.json ./
COPY src ./src/

# Compile TypeScript to dist/
RUN npm run build

# Remove development dependencies
RUN npm prune --production

# --- Production Runner Stage ---
FROM node:20-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Install runtime OpenSSL and CA certificates
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Create non-root system user and group for security
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 -g nodejs expressjs

# Copy node_modules, built dist, and prisma artifacts from builder
COPY --from=builder --chown=expressjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=expressjs:nodejs /app/dist ./dist
COPY --from=builder --chown=expressjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=expressjs:nodejs /app/package.json ./package.json

USER expressjs

EXPOSE 8080

CMD ["node", "dist/server.js"]
