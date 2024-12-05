#!/bin/sh

# Vérifier que la variable DB_HOST est définie
if [ -z "$DB_HOST" ]; then
  echo "Error: DB_HOST is not set."
  exit 1
fi

# Vérifier que la variable DB_PORT est définie, sinon utiliser le port MySQL par défaut (3306)
DB_PORT="${DB_PORT:-3306}"

echo "Waiting for database at $DB_HOST:$DB_PORT to be ready..."

# Attendre que la base de données soit accessible
until nc -z "$DB_HOST" "$DB_PORT"; do
  echo "Database is not ready yet. Retrying..."
  sleep 2
done

echo "Database is ready. Starting the application."

# Passer les commandes fournies en arguments au script
exec "$@"
