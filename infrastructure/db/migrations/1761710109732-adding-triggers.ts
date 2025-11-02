import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingTriggers1761710109732 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `-- Función mejorada con validaciones para manejo de inventario
CREATE OR REPLACE FUNCTION update_consumables_on_sale()
RETURNS TRIGGER AS $$
DECLARE
    rec record;
    product_quantity DECIMAL(10,2);
    ingredient_quantity DECIMAL(10,2);
    current_stock DECIMAL(10,2);
BEGIN
    -- Validar que el producto existe y está activo
    IF NOT EXISTS (SELECT 1 FROM products WHERE product_id = NEW.product_id AND active = TRUE) THEN
        RAISE EXCEPTION 'Producto ID % no existe o no está activo', NEW.product_id;
    END IF;
    
    product_quantity := NEW.quantity;
    
    -- Verificar stock suficiente antes de realizar la venta
    FOR rec IN 
        SELECT 
            i.ingredient_id,
            i.quantity as quantity_per_product,
            i.consumable_id,
            c.name as consumable_name,
            c.quantity as current_stock
        FROM ingredients i
        INNER JOIN "Consumable" c ON i.consumable_id = c.consumable_id
        WHERE i.product_id = NEW.product_id
    LOOP
        ingredient_quantity := rec.quantity_per_product * product_quantity;
        current_stock := rec.current_stock;
        
        -- Verificar si hay suficiente stock
        IF current_stock < ingredient_quantity THEN
            RAISE EXCEPTION 'Stock insuficiente para % (ID: %). Stock actual: %, Se necesita: %',
                rec.consumable_name, 
                rec.consumable_id,
                current_stock,
                ingredient_quantity;
        END IF;
    END LOOP;
    
    -- Si hay suficiente stock, proceder con la actualización
    FOR rec IN 
        SELECT 
            i.ingredient_id,
            i.quantity as quantity_per_product,
            i.consumable_id,
            c.name as consumable_name
        FROM ingredients i
        INNER JOIN "Consumable" c ON i.consumable_id = c.consumable_id
        WHERE i.product_id = NEW.product_id
    LOOP
        ingredient_quantity := rec.quantity_per_product * product_quantity;
        
        -- Actualizar el stock
        UPDATE "Consumable" 
        SET quantity = quantity - ingredient_quantity
        WHERE consumable_id = rec.consumable_id;
        
        -- Notificación para stock bajo
        IF (SELECT quantity FROM "Consumable" WHERE consumable_id = rec.consumable_id) < 5 THEN
            RAISE NOTICE 'ALERTA: Stock bajo para % (ID: %). Cantidad actual: %', 
                rec.consumable_name,
                rec.consumable_id, 
                (SELECT quantity FROM "Consumable" WHERE consumable_id = rec.consumable_id);
        END IF;
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear el trigger
CREATE TRIGGER trigger_update_consumables_on_sale
    AFTER INSERT ON bill_details
    FOR EACH ROW
    EXECUTE FUNCTION update_consumables_on_sale();`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TRIGGER IF EXISTS trigger_update_consumables_on_sale ON bill_details;
        DROP FUNCTION IF EXISTS update_consumables_on_sale();
    `);
  }
}
