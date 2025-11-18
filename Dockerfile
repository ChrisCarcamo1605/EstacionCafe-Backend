# Etapa 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig.json ./

# Instalar todas las dependencias (incluyendo devDependencies para compilar)
RUN npm ci

# Copiar código fuente
COPY . .

# Compilar TypeScript
RUN npx tsc

# Etapa 2: Production
FROM node:20-alpine

WORKDIR /app

# Instalar herramientas necesarias para el script de inicialización y healthcheck
RUN apk add --no-cache postgresql-client netcat-openbsd wget

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependencias de producción + las necesarias para migraciones (TypeScript, TypeORM CLI)
RUN npm ci --only=production && \
    npm install -D typescript ts-node @types/node

# Copiar código compilado desde builder
COPY --from=builder /app/src/compiled ./src/compiled

# Copiar archivos TypeScript necesarios para migraciones y seeds
COPY --from=builder /app/core ./core
COPY --from=builder /app/application ./application
COPY --from=builder /app/controller ./controller
COPY --from=builder /app/infrastructure ./infrastructure
COPY --from=builder /app/main.ts ./main.ts

# Copiar archivos de variables de entorno (templates)
COPY DB_CREDENTIALS.env ./
COPY SECURITY_CREDENTIALS.env ./

# Exponer puerto
EXPOSE 3484

# Script de inicio que ejecutará migraciones y seeds
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

ENTRYPOINT ["./docker-entrypoint.sh"]
