#!/bin/sh
set -e

until psql -h db -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing command"
psql -h db -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /app/init.sql
