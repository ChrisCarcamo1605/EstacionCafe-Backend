//Las variables de entorno ya están cargadas en main.ts
import "./loadEnv";
import { DataSource } from "typeorm";
import { dirname, isAbsolute, join, resolve } from "path";
import { existsSync, mkdirSync } from "fs";

const sqlitePathFromEnv = process.env.DB_SQLITE_PATH?.trim();
const sqlitePath = sqlitePathFromEnv
  ? isAbsolute(sqlitePathFromEnv)
    ? sqlitePathFromEnv
    : resolve(process.cwd(), sqlitePathFromEnv)
  : join(process.cwd(), "estacioncafe.sqlite");

const sqliteDirectory = dirname(sqlitePath);
if (!existsSync(sqliteDirectory)) {
  mkdirSync(sqliteDirectory, { recursive: true });
}

// Production: always disable synchronize to allow migrations to manage schema
// Development: can be overridden via env var
const isDev = process.env.NODE_ENV === "development";
const synchronizeDb = isDev && (process.env.DB_SYNCHRONIZE || "true").toLowerCase() === "true";
const enableDbLogging = (process.env.DB_LOGGING || "false").toLowerCase() === "true";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: sqlitePath,
  synchronize: synchronizeDb,
  logging: enableDbLogging,
  entities: [join(__dirname, "../../core/entities/*{.ts,.js}")],
  migrations: [join(__dirname, "./migrations/*{.ts,.js}")],
  subscribers: [join(__dirname, "./subscribers/*{.ts,.js}")],
});

export const getDataSource = () => {
  return AppDataSource;
};

export const runMigrations = async () => {
  if (!AppDataSource.isInitialized) {
    throw new Error("DataSource must be initialized before running migrations");
  }

  console.log("Verificando migraciones pendientes...");
  const hasPending = await AppDataSource.showMigrations();
  
  if (!hasPending) {
    console.log("No hay migraciones pendientes. Base de datos actualizada.");
    return;
  }

  console.log("Ejecutando migraciones pendientes para crear/actualizar tablas...");
  await AppDataSource.runMigrations();
  console.log("✅ Migraciones ejecutadas correctamente. Base de datos lista.");
};

export default AppDataSource;

module.exports = { getDataSource, AppDataSource, runMigrations };
