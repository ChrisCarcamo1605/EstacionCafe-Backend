# EstacionCafé API ☕

Una API REST completa para la gestión de cafeterías construida con TypeScript, Express.js y SQLite utilizando arquitectura limpia con inyección manual de dependencias.

## 🚀 Características Principales

- **Arquitectura Limpia**: Separación clara entre capas de entidades, servicios, controladores y rutas
- **TypeScript**: Código fuertemente tipado con validaciones usando Zod
- **SQLite + TypeORM**: Base de datos embebida con ORM y migraciones automáticas
- **Testing**: Suite completa de pruebas unitarias con Jest
- **Base de Datos**: SQLite con TypeORM
- **Inyección de Dependencias**: Sistema manual de DI para máximo control
- **Validación de Datos**: Esquemas Zod con transformaciones personalizadas
- **Seeders**: Sistema de población de datos inicial

## 📋 Funcionalidades del Sistema

### Gestión de Productos

- CRUD completo de productos con precios y costos
- Filtrado de productos activos
- Gestión de ingredientes por producto

### Sistema de Facturación

- Creación y gestión de facturas
- Detalles de factura con productos
- Consultas por cliente y rangos de fecha

### Gestión de Usuarios

- Sistema de usuarios con tipos/roles
- Autenticación con bcrypt
- Filtrado por tipo de usuario

### Inventario y Compras

- Gestión de consumibles y tipos de consumibles
- Sistema de proveedores
- Registro de compras con relaciones

### Cajas Registradoras

- Gestión de múltiples cajas
- Estados activos/inactivos
- Consultas por número de caja

## 🏗️ Arquitectura del Proyecto

```
EstacionCafé/
├── core/                          # Capa de dominio
│   ├── entities/                  # Entidades TypeORM
│   ├── enums/                     # Enumeraciones del sistema
│   └── interfaces/                # Interfaces de servicios
├── application/                   # Capa de aplicación
│   ├── services/                  # Lógica de negocio
│   ├── DTOs/                      # Data Transfer Objects
│   ├── validations/               # Esquemas Zod
│   └── Routes/                    # Definición de rutas
├── controller/                    # Capa de presentación
│   └── __tests__/                 # Tests de controladores
├── infrastructure/                # Capa de infraestructura
│   └── db/                        # Conexión, migraciones y seeders
└── src/compiled/                 # Código TypeScript compilado
```

## 🛠️ Tecnologías Utilizadas

- **Backend**: Node.js, Express.js, TypeScript
- **Base de Datos**: SQLite, TypeORM
- **Validación**: Zod (con transformaciones personalizadas)
- **Testing**: Jest, ts-jest
- **Contenedores**: Docker, Docker Compose
- **Otros**: bcrypt, CORS, nodemon

## 📦 Instalación y Configuración

### Prerrequisitos

- Node.js (v16 o superior)
- Docker y Docker Compose
- Git

### Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/ChrisCarcamo1605/EstacionCaf-.git
cd EstacionCafé
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Base de datos local (SQLite)**

```bash
# SQLite se crea automáticamente en ./estacioncafe.sqlite
```

4. **Compilar TypeScript** (automático al iniciar)

```bash
npm start
```

## 🚀 Scripts Disponibles

### Desarrollo

```bash
npm start              # Iniciar servidor en modo desarrollo
```

### Testing

```bash
npm test              # Ejecutar todos los tests
npm run test:watch    # Tests en modo watch
npm run test:coverage # Reporte de cobertura
npm run test:verbose  # Tests con salida detallada
```

### Base de Datos

```bash
# Migraciones
npm run migration:run       # Ejecutar migraciones
npm run migration:show      # Mostrar migraciones
npm run migration:revert    # Revertir última migración
npm run migration:generate  # Generar nueva migración

# Seeders
npm run seed:run      # Poblar base de datos
npm run seed:revert   # Limpiar datos de prueba
```

## 🌐 API Endpoints

### Base URL: `http://localhost:3484/api`

### Documentación interactiva (Swagger)

- **URL**: `http://localhost:3484/api/docs`
- En despliegue, reemplazar `localhost:3484` por el dominio público.
- Los endpoints `DELETE` requieren token Bearer.

### Productos

```http
GET    /products              # Obtener todos los productos
GET    /products/active       # Obtener productos activos
GET    /products/:id          # Obtener producto por ID
POST   /products              # Crear nuevo producto
PUT    /products/:id          # Actualizar producto
DELETE /products/:id          # Eliminar producto
```

### Facturas

```http
GET    /bills                         # Obtener todas las facturas
GET    /bills/:id                     # Obtener factura por ID
GET    /bills/customer/:customer      # Facturas por cliente
GET    /bills/date-range             # Facturas por rango de fechas
POST   /bills                        # Crear nueva factura
PUT    /bills/:id                    # Actualizar factura
DELETE /bills/:id                    # Eliminar factura
```

### Usuarios

```http
GET    /users                 # Obtener todos los usuarios
GET    /users/:id             # Obtener usuario por ID
GET    /users/type/:typeId    # Usuarios por tipo
POST   /users                 # Crear nuevo usuario
PUT    /users/:id             # Actualizar usuario
DELETE /users/:id             # Eliminar usuario
```

### Proveedores

```http
GET    /suppliers              # Obtener todos los proveedores
GET    /suppliers/active       # Obtener proveedores activos
GET    /suppliers/:id          # Obtener proveedor por ID
POST   /suppliers              # Crear nuevo proveedor
PUT    /suppliers/:id          # Actualizar proveedor
DELETE /suppliers/:id          # Eliminar proveedor
```

### Otros Endpoints

- **Consumibles**: `/consumable`
- **Tipos de Consumibles**: `/consumable-type`
- **Ingredientes**: `/ingredient`
- **Compras**: `/purchases`
- **Cajas Registradoras**: `/cash-registers`
- **Tipos de Usuario**: `/user-types`
- **Detalles de Factura**: `/bill-details`

## 📊 Base de Datos

### Configuración

- **Motor**: SQLite
- **Archivo**: `estacioncafe.sqlite`

### Principales Entidades

- `products` - Productos del menú
- `bills` - Facturas del sistema
- `bill_details` - Detalles de cada factura
- `users` - Usuarios del sistema
- `suppliers` - Proveedores
- `consumables` - Insumos/consumibles
- `cash_registers` - Cajas registradoras

## 🧪 Testing

El proyecto incluye una suite completa de pruebas unitarias:

- **Cobertura**: Tests para todos los controladores
- **Mocking**: Servicios simulados para pruebas aisladas
- **Validación**: Tests de esquemas Zod
- **Manejo de Errores**: Pruebas de casos de error

Ejecutar tests:

```bash
npm test                    # Ejecutar todos los tests
npm run test:coverage      # Con reporte de cobertura
```

## 🔧 Patrones de Desarrollo

### Inyección de Dependencias Manual

```typescript
// Cada controlador expone un setService
export const setService = (productService: IService) => {
  service = productService;
};

// La inyección se configura en dependencyInjection.ts
setProductService(productService);
```

### Validación con Zod

```typescript
// Transformaciones personalizadas
const productSchema = z.object({
  price: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val) && val > 0, "El precio debe ser mayor a 0"),
});
```

### Manejo de Errores Consistente

```typescript
// Respuesta estándar de error
return res.status(400).send({
  status: "error",
  message: "Datos inválidos",
  campo: error.issues[0].path,
  error: error.issues[0].code,
});
```

## � Docker y Despliegue

### 🎯 Configuración Simple (Solo API + DB)

```bash
docker-compose up -d
```

Ver documentación completa en: [DOCKER_SETUP.md](DOCKER_SETUP.md)

### 🏗️ Configuración Multi-Proyecto (API + Frontend + ML + DB)

```bash
# Usando el script helper (recomendado)
.\docker-multi-helper.ps1 start

# O manualmente
docker-compose -f docker-compose.multi.yml up -d --build
```

**Servicios incluidos:**

- **API**: http://localhost:3484/api
- **Frontend (Astro)**: http://localhost:4321
- **Frontend (Express)**: http://localhost:3000
- **ML Service**: http://localhost:8000
- **SQLite**: archivo local `./estacioncafe.sqlite`

Ver documentación completa en: [ARQUITECTURA_MULTI_PROYECTO.md](ARQUITECTURA_MULTI_PROYECTO.md)

### Desarrollo Local (sin Docker)

1. Clonar repositorio
2. `npm install`
3. `npm run build`
4. `npm start`

### Despliegue en Railway

1. Conectar el repositorio en Railway (usa `railway.json` del proyecto).
2. Crear un volumen persistente y montar una ruta como `/data`.
3. Definir variables de entorno:
   - `PORT` (Railway la inyecta automáticamente)
   - `CORS_ORIGIN` (ej. `https://tu-frontend.up.railway.app`)
   - `DB_SQLITE_PATH=/data/estacioncafe.sqlite`
   - `DB_SYNCHRONIZE=false` (recomendado en producción)
   - `DB_LOGGING=false`
4. Deploy: Railway ejecutará `npm run build` y luego `npm run start:prod`.

### Producción

- Configurar variables de entorno para base de datos y CORS
- Establecer `DB_SYNCHRONIZE=false` en producción
- Usar migraciones para cambios de esquema
- Configurar logs apropiados
- Cambiar credenciales por defecto

## 📝 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo `LICENSE` para más detalles.

## 👤 Autor

**Christian Carcamo**

- GitHub: [@ChrisCarcamo1605](https://github.com/ChrisCarcamo1605)
- Proyecto: [EstacionCafé](https://github.com/ChrisCarcamo1605/EstacionCaf-)

---
