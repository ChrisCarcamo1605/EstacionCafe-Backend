import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAllTables1761710200000 implements MigrationInterface {
  name = "CreateAllTables1761710200000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Lookup tables (no foreign keys)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "consumable_type" (
        "consumable_type_id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "name" varchar NOT NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "suppliers" (
        "supplier_id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "name" varchar(100) NOT NULL,
        "phone" varchar(20) NOT NULL,
        "email" varchar(100) NOT NULL,
        "active" boolean NOT NULL DEFAULT (1)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "product_types" (
        "product_type_id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "name" varchar NOT NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user_types" (
        "primary_type_id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "name" varchar NOT NULL,
        "permissionLevel" integer NOT NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "tables" (
        "table_id" varchar(10) PRIMARY KEY NOT NULL,
        "zone" varchar(50) NOT NULL,
        "status" varchar CHECK("status" IN ('disponible','ocupada','reservada')) NOT NULL DEFAULT ('disponible')
      )
    `);

    // 2. Tables with foreign keys
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "Consumable" (
        "consumable_id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "supplier_id" integer NOT NULL,
        "name" varchar NOT NULL,
        "consumable_type_id" integer NOT NULL,
        "quantity" float NOT NULL,
        "unitMeasurement" varchar NOT NULL,
        "cost" numeric(10,2) NOT NULL,
        "active" boolean NOT NULL DEFAULT (1),
        CONSTRAINT "FK_consumable_supplier" FOREIGN KEY ("supplier_id") REFERENCES "suppliers" ("supplier_id"),
        CONSTRAINT "FK_consumable_type" FOREIGN KEY ("consumable_type_id") REFERENCES "consumable_type" ("consumable_type_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "products" (
        "product_id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "name" varchar NOT NULL,
        "description" varchar NOT NULL,
        "price" decimal(10,2) NOT NULL,
        "cost" decimal(10,2) NOT NULL,
        "active" boolean NOT NULL,
        "product_type_id" integer,
        CONSTRAINT "FK_product_type" FOREIGN KEY ("product_type_id") REFERENCES "product_types" ("product_type_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "user_id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "username" varchar NOT NULL UNIQUE,
        "type_id" integer NOT NULL,
        "password" varchar NOT NULL,
        "email" varchar NOT NULL,
        "active" boolean NOT NULL,
        CONSTRAINT "FK_user_type" FOREIGN KEY ("type_id") REFERENCES "user_types" ("primary_type_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "ingredients" (
        "ingredient_id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "consumable_id" integer NOT NULL,
        "name" varchar NOT NULL,
        "quantity" decimal(10,2) NOT NULL,
        "product_id" integer NOT NULL,
        CONSTRAINT "FK_ingredient_consumable" FOREIGN KEY ("consumable_id") REFERENCES "Consumable" ("consumable_id"),
        CONSTRAINT "FK_ingredient_product" FOREIGN KEY ("product_id") REFERENCES "products" ("product_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "bills" (
        "bill_id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "cash_register" integer NOT NULL,
        "table_id" varchar(10),
        "customer" varchar NOT NULL,
        "date" datetime NOT NULL,
        "total" decimal(10,2) NOT NULL,
        "status" varchar NOT NULL DEFAULT ('draft'),
        "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        CONSTRAINT "FK_bill_cash_register" FOREIGN KEY ("cash_register") REFERENCES "users" ("user_id"),
        CONSTRAINT "FK_bill_table" FOREIGN KEY ("table_id") REFERENCES "tables" ("table_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "bill_details" (
        "bill_details_id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "bill_id" integer NOT NULL,
        "product_id" integer NOT NULL,
        "quantity" integer NOT NULL,
        "sub_total" decimal(10,2) NOT NULL,
        CONSTRAINT "FK_bill_detail_bill" FOREIGN KEY ("bill_id") REFERENCES "bills" ("bill_id"),
        CONSTRAINT "FK_bill_detail_product" FOREIGN KEY ("product_id") REFERENCES "products" ("product_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "purchases" (
        "purchase_id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "date" datetime NOT NULL,
        "cash_register" integer NOT NULL,
        "supplier_id" integer NOT NULL,
        "total" decimal(10,2) NOT NULL,
        CONSTRAINT "FK_purchase_supplier" FOREIGN KEY ("supplier_id") REFERENCES "suppliers" ("supplier_id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "purchases"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "bill_details"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "bills"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "ingredients"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "products"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "Consumable"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tables"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_types"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "product_types"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "suppliers"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "consumable_type"`);
  }
}
