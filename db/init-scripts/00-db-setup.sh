#!/bin/bash
set -e

# Initialize tables and permissions
SQL=$(cat <<-EOSQL
    -- Permissions setup
    --REVOKE ALL ON SCHEMA public FROM PUBLIC;
    --GRANT ALL ON SCHEMA public TO ${POSTGRES_USER};

    -- Revoke public access (critical for production)
    REVOKE ALL ON DATABASE ${POSTGRES_DB} FROM PUBLIC;
    REVOKE ALL ON SCHEMA public FROM PUBLIC;

    -- Grant full permissions only to your app user
    GRANT ALL PRIVILEGES ON DATABASE ${POSTGRES_DB} TO ${POSTGRES_USER};
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ${POSTGRES_USER};

    -- Create tables
    CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
    );

    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
EOSQL
)

# Execute the generated SQL
psql -d $POSTGRES_DB -U $POSTGRES_USER -v ON_ERROR_STOP=1 <<< "$SQL"
