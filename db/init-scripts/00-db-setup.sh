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
    CREATE TABLE IF NOT EXISTS short_urls (
        id SERIAL PRIMARY KEY,
        short_code VARCHAR(10) UNIQUE NOT NULL,
        original_url TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        clicks INTEGER DEFAULT 0
    );

    CREATE INDEX idx_short_code ON short_urls(short_code);
    
EOSQL
)

# Execute the generated SQL
psql -d $POSTGRES_DB -U $POSTGRES_USER -v ON_ERROR_STOP=1 <<< "$SQL"
