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
    CREATE TABLE IF NOT EXISTS todo_tasks (
    id SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    date_added TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    date_completed TIMESTAMP WITH TIME ZONE,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE
);

    -- Index for filtering by completion status
    CREATE INDEX idx_todo_completed ON todo_tasks(is_completed);
    
EOSQL
)

# Execute the generated SQL
psql -d $POSTGRES_DB -U $POSTGRES_USER -v ON_ERROR_STOP=1 <<< "$SQL"
