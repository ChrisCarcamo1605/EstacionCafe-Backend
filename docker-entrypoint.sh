#!/bin/sh

echo "==========================================="
echo "Iniciando EstacionCafé API"
echo "==========================================="

# Esperar a que PostgreSQL esté listo
echo "Esperando a que la base de datos esté lista..."
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 1
done
echo "✓ Base de datos conectada"

# Verificar si es la primera ejecución (revisar si existe una tabla específica)
echo "Verificando estado de la base de datos..."

# Usar psql para verificar si las tablas existen
TABLE_EXISTS=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -d $DB_NAME -tAc "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public' AND table_name='users';")

if [ "$TABLE_EXISTS" = "0" ]; then
  echo "==========================================="
  echo "Primera ejecución detectada"
  echo "==========================================="
  
  echo "→ Iniciando servidor temporalmente para generar tablas con synchronize..."
  # Iniciar el servidor en background para que TypeORM cree las tablas
  npm start &
  SERVER_PID=$!
  
  # Esperar a que el servidor esté listo (intentar conectar al puerto)
  echo "→ Esperando a que el servidor genere las tablas..."
  for i in $(seq 1 30); do
    if nc -z localhost 3484 2>/dev/null; then
      echo "✓ Servidor iniciado y tablas generadas"
      break
    fi
    sleep 2
  done
  
  # Detener el servidor temporal
  echo "→ Deteniendo servidor temporal..."
  kill $SERVER_PID
  wait $SERVER_PID 2>/dev/null
  
  # Pequeña espera para asegurar que el servidor se cerró
  sleep 2
  
  echo "→ Ejecutando migraciones..."
  npm run migration:run
  
  if [ $? -eq 0 ]; then
    echo "✓ Migraciones ejecutadas correctamente"
  else
    echo "⚠ No se pudieron ejecutar migraciones (puede ser normal si synchronize ya creó todo)"
  fi
  
  echo "→ Ejecutando seeds..."
  npm run seed:run
  
  if [ $? -eq 0 ]; then
    echo "✓ Seeds ejecutados correctamente"
  else
    echo "✗ Error al ejecutar seeds"
    exit 1
  fi
else
  echo "Base de datos ya inicializada, omitiendo inicialización"
fi

echo "==========================================="
echo "Iniciando servidor definitivo..."
echo "==========================================="
exec npm start
