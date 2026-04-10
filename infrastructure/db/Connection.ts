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

const synchronizeDb = (process.env.DB_SYNCHRONIZE || "true").toLowerCase() === "true";
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

export default AppDataSource;

module.exports = { getDataSource, AppDataSource };
