# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for compilation)
RUN npm ci

# Copy source code
COPY . .

# Compile TypeScript
RUN npx tsc

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy compiled code from builder
COPY --from=builder /app/src/compiled ./src/compiled

# Copy infrastructure files needed for runtime (migrations, seeders, swagger)
COPY --from=builder /app/infrastructure ./infrastructure

# Copy core files
COPY --from=builder /app/core ./core

# Copy application files
COPY --from=builder /app/application ./application

# Copy controller files
COPY --from=builder /app/controller ./controller

# Create data directory for SQLite
RUN mkdir -p /app/data

# Expose port
EXPOSE 3484

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3484/api/ || exit 1

# Start the application
CMD ["node", "./src/compiled/main.js"]
