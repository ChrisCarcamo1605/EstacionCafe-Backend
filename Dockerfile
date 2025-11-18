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

# Install all dependencies (needed for nodemon, ts-node, typeorm migrations)
RUN npm ci

# Copy compiled code from builder
COPY --from=builder /app/src/compiled ./src/compiled

# Copy all source files (needed for migrations and seeders with ts-node)
COPY --from=builder /app ./

# Expose port
EXPOSE 3484

# Start the application
CMD ["node", "./src/compiled/main.js"]
