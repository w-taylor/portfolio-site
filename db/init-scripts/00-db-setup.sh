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

    CREATE TABLE monitored_services (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        url TEXT NOT NULL,
        base_url TEXT NOT NULL,
        description TEXT NOT NULL,
        expected_status INTEGER DEFAULT 200,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        is_active BOOLEAN DEFAULT true
    );

    CREATE TABLE service_checks (
        id SERIAL PRIMARY KEY,
        service_id INTEGER REFERENCES monitored_services(id) ON DELETE CASCADE,
        status_code INTEGER,
        response_time INTEGER, -- milliseconds
        status TEXT, -- 'up', 'down', 'slow'
        error_message TEXT,
        checked_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX idx_service_checks_service_id ON service_checks(service_id);
    CREATE INDEX idx_service_checks_checked_at ON service_checks(checked_at);

    CREATE TABLE node_sweep_games (
        id SERIAL PRIMARY KEY,
        game_id VARCHAR(36) UNIQUE NOT NULL,
        mode VARCHAR(20) NOT NULL,
        winner VARCHAR(10),
        total_probes INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        finished_at TIMESTAMPTZ
    );

    CREATE INDEX idx_node_sweep_game_id ON node_sweep_games(game_id);

EOSQL
)

# Execute the generated SQL
psql -d $POSTGRES_DB -U $POSTGRES_USER -v ON_ERROR_STOP=1 <<< "$SQL"
