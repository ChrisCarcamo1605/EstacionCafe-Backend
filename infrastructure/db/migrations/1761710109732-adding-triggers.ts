import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingTriggers1761710109732 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // La lógica de inventario se movió a la capa de aplicación para SQLite.
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS trigger_update_consumables_on_sale;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS trigger_update_consumables_on_sale;
    `);
  }
}
