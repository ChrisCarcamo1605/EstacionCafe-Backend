# 🚀 Guía de Despliegue en Render

Esta guía te ayudará a desplegar la API de EstacionCafé en Render.com usando Docker.

## 📋 Prerrequisitos

- Cuenta en [Render.com](https://render.com)
- Repositorio en GitHub con el código
- Docker instalado (para pruebas locales)

## 🐳 Estructura de Archivos de Despliegue

El proyecto incluye los siguientes archivos para despliegue:

| Archivo | Propósito |
|---------|-----------|
| `Dockerfile` | Configuración de contenedor multi-etapa optimizado |
| `.dockerignore` | Archivos excluidos de la imagen Docker |
| `render.yaml` | Configuración automática para Render |
| `.env.example` | Plantilla de variables de entorno |

## 🔧 Configuración Local

### 1. Variables de Entorno

Copia `.env.example` a `.env` y ajusta los valores:

```bash
# Ya creado con valores de desarrollo
NODE_ENV=development
CORS_ORIGIN=*
PORT=3484
DB_SQLITE_PATH=./data/estacioncafe.db
DB_SYNCHRONIZE=false
DB_LOGGING=false
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h
```

### 2. Compilar y Ejecutar Localmente

```bash
# Instalar dependencias
npm install

# Compilar TypeScript
npm run build

# Ejecutar en modo desarrollo
npm start

# O ejecutar directamente
npm run start:prod
```

### 3. Prueba Local con Docker

```bash
# Construir la imagen
docker build -t estacioncafe-api .

# Ejecutar el contenedor
docker run -p 3484:3484 \
  -e NODE_ENV=production \
  -e CORS_ORIGIN=http://localhost:3000 \
  -e JWT_SECRET=mi-secreto-super-seguro \
  estacioncafe-api

# Verificar que funciona
curl http://localhost:3484/api/
```

## 🌐 Despliegue en Render

### Opción 1: Usando el Dashboard (Recomendado)

#### Paso 1: Conectar el Repositorio

1. Ve a [dashboard.render.com](https://dashboard.render.com)
2. Haz clic en **New +** → **Web Service**
3. Conecta tu cuenta de GitHub
4. Selecciona el repositorio `EstacionCafe-Backend`

#### Paso 2: Configurar el Servicio

Completa los siguientes campos:

| Campo | Valor |
|-------|-------|
| **Name** | `estacioncafe-api` |
| **Region** | Oregon (más cercano a LATAM) |
| **Branch** | `main` |
| **Root Directory** | Déjalo vacío |
| **Environment** | `Docker` |
| **Plan** | Free (o Starter para producción) |

#### Paso 3: Configurar Variables de Entorno

Haz clic en **Advanced** → **Add Environment Variable** y agrega:

```
NODE_ENV = production
PORT = 3484
CORS_ORIGIN = https://tu-frontend-domain.com
DB_SQLITE_PATH = /data/estacioncafe.db
DB_SYNCHRONIZE = false
DB_LOGGING = false
JWT_SECRET = (haz clic en "Generate" para uno seguro)
JWT_EXPIRES_IN = 24h
```

> **⚠️ Importante**: Para `CORS_ORIGIN`, usa la URL de tu frontend desplegado. Si aún no tienes frontend, puedes usar `*` temporalmente (no recomendado para producción).

#### Paso 4: Configurar Volumen Persistente

Como usamos SQLite, necesitamos persistir la base de datos:

1. Ve a la sección **Disks** en tu servicio
2. Haz clic en **Add Disk**
3. Configura:
   - **Name**: `estacioncafe-data`
   - **Mount Path**: `/data`
   - **Size**: 1 GB (suficiente para SQLite)

#### Paso 5: Desplegar

Haz clic en **Create Web Service** y espera a que el despliegue termine (~3-5 minutos).

### Opción 2: Usando render.yaml (Infraestructura como Código)

El archivo `render.yaml` ya está configurado. Solo necesitas:

```bash
# Instalar Render CLI
npm install -g @render-cloud/cli

# Login
render login

# Desplegar
render up
```

## ✅ Verificar el Despliegue

### 1. Health Check

```bash
# Reemplaza con tu URL de Render
curl https://estacioncafe-api.onrender.com/api/
```

Deberías ver una respuesta JSON o la documentación Swagger.

### 2. Swagger UI

Visita: `https://estacioncafe-api.onrender.com/api/docs`

### 3. Probar Endpoints

```bash
# Obtener productos
curl https://estacioncafe-api.onrender.com/api/products

# Crear producto (requiere auth)
curl -X POST https://estacioncafe-api.onrender.com/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Café Americano","price":"2.50"}'
```

## 🔧 Ejecutar Migraciones en Render

Después del primer despliegue:

### Opción 1: Consola Web

1. Ve a tu servicio en Render Dashboard
2. Haz clic en **Shell** (pestaña superior)
3. Ejecuta:

```bash
npm run migration:run
npm run seed:run  # Opcional: datos iniciales
```

### Opción 2: SSH

```bash
# Desde tu terminal local
ssh tu-servicio@shell.onrender.com

# Luego ejecuta
npm run migration:run
```

## 🔍 Monitoreo y Logs

### Ver Logs en Tiempo Real

En el Dashboard de Render:
- Ve a tu servicio
- Pestaña **Logs**
- Verás logs en tiempo real de la aplicación

### Logs Comunes

```
✅ Inicializando dependencias...
✅ Servicios configurados
✅ Servidor corriendo en puerto 3484
✅ Migraciones ejecutadas correctamente
```

## 🚨 Solución de Problemas

### Error: CORS

**Síntoma**: `Error: Origen no permitido por CORS`

**Solución**:
```bash
# En Render Dashboard, actualiza CORS_ORIGIN
CORS_ORIGIN = https://tu-dominio.com,https://www.otro-dominio.com
```

### Error: Base de Datos

**Síntoma**: `Error: SQLITE_ERROR: no such table: products`

**Solución**:
```bash
# Ejecuta migraciones desde la consola web
npm run migration:run
```

### Error: Puerto

**Síntoma**: `Error: listen EADDRINUSE: address already in use :::3484`

**Solución**: Render establece automáticamente la variable `PORT`. El código ya lo maneja:
```typescript
const port = parseInt(process.env.PORT || "3484", 10);
```

### Error: Health Check Fallido

**Síntoma**: Render reporta "Health check failed"

**Solución**:
1. Verifica que la ruta `/api/` responda correctamente
2. Aumenta el **Start Period** en la configuración de health check a 60s
3. Revisa los logs para ver errores de inicio

## 💰 Costos Estimados

### Plan Gratuito

- ✅ 750 horas/mes (suficiente para 1 servicio)
- ✅ 1 GB almacenamiento persistente
- ✅ 400 GB ancho de banda
- ⚠️ Se suspende tras 15 min de inactividad

### Plan Starter ($7/mes)

- ✅ Sin suspensión por inactividad
- ✅ 10 GB almacenamiento
- ✅ 2 TB ancho de banda
- ✅ Logs extendidos

## 🔐 Mejores Prácticas de Seguridad

1. **Nunca commitees `.env`** - Ya está en `.gitignore`
2. **Genera JWT_SECRET seguro**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
3. **Restringe CORS** - No uses `*` en producción
4. **Usa HTTPS** - Render lo proporciona automáticamente
5. **Rota JWT_SECRET** cada 3-6 meses

## 📊 Variables de Entorno Resumen

| Variable | Requerido | Descripción | Ejemplo |
|----------|-----------|-------------|---------|
| `NODE_ENV` | ✅ | Entorno | `production` |
| `PORT` | ✅ | Puerto | `3484` |
| `CORS_ORIGIN` | ✅ | Orígenes permitidos | `https://frontend.com` |
| `DB_SQLITE_PATH` | ✅ | Ruta DB SQLite | `/data/estacioncafe.db` |
| `DB_SYNCHRONIZE` | ✅ | Auto-sync schema | `false` |
| `DB_LOGGING` | ❌ | Log consultas | `false` |
| `JWT_SECRET` | ✅ | Clave JWT | (aleatoria) |
| `JWT_EXPIRES_IN` | ❌ | Expiración token | `24h` |

## 🔄 Actualizaciones

### Desplegar Cambios

Cada push a la rama `main` desencadenará un despliegue automático:

```bash
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main
# Render despliega automáticamente
```

### Despliegue Manual

Si necesitas desplegar sin hacer push:

```bash
# Desde Render Dashboard
Deploy → Deploy Latest Commit
```

## 📝 Checklist Pre-Despliegue

Antes de desplegar en producción:

- [ ] `.env` NO está commiteado
- [ ] CORS_ORIGIN configurado correctamente
- [ ] JWT_SECRET generado de forma segura
- [ ] DB_SYNCHRONIZE = `false`
- [ ] Volumen persistente configurado en `/data`
- [ ] Migraciones probadas en staging
- [ ] Health check configurado en `/api/`
- [ ] Tests pasan localmente: `npm test`
- [ ] Build funciona: `npm run build`

## 🆘 Soporte

Si encuentras problemas:

1. Revisa los **logs** en Render Dashboard
2. Verifica las **variables de entorno**
3. Prueba localmente con Docker
4. Consulta la documentación de [Render](https://render.com/docs)
5. Abre un issue en el repositorio

---

**¡Listo!** Tu API de EstacionCafé está desplegada y lista para recibir tráfico. ☕🚀
