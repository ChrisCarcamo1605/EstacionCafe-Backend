// Cargar variables de entorno PRIMERO
require("dotenv").config({ path: "./DB_CREDENTIALS.env" });

import { getDataSource } from "../Connection";
import { DatabaseSeeder } from "./DatabaseSeeder";

async function seedDatabase() {
  try {
    const AppDataSource = await getDataSource();
    // Inicializar conexión
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const seeder = new DatabaseSeeder(AppDataSource);
    await seeder.runAll();

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error("---ERROR--- Error during seeding:", error);
    process.exit(1);
  }
}

async function revertSeeds() {
  try {
    const AppDataSource = await getDataSource();
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const seeder = new DatabaseSeeder(AppDataSource);
    await seeder.revertAll();

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error("---ERROR--- Error during seed revert:", error);
    process.exit(1);
  }
}

// Ejecutar según el argumento
const command = process.argv[2];

if (command === "revert") {
  revertSeeds();
} else {
  seedDatabase();
}
