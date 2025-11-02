//Las variables de entorno ya están cargadas en main.ts
import { DataSource } from "typeorm";
import { join } from "path";


const db_host = process.env.DB_HOST;
const db_port = parseInt(process.env.DB_PORT || "5555");
const db_username = process.env.DB_USERNAME;
const db_password = process.env.DB_PASSWORD;
const db_name = process.env.DB_NAME;

export const AppDataSource = new DataSource({
  type: "postgres",
  host: db_host,
  port: db_port,
  username: db_username,
  password: db_password,
  database: db_name,
  synchronize: true,
  logging: false,
  entities: [join(__dirname,'../../core/entities/*{.ts,.js}')
  ],
  migrations: [join(__dirname,'./migrations/*{.ts,.js}')],
  subscribers: [],
});

export const getDataSource = () => {
  return AppDataSource;
};

export default AppDataSource;

module.exports = { getDataSource, AppDataSource };


