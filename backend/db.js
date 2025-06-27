import pgpkg from 'pg';

const { Pool } = pgpkg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST || 'db',
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

export const query = (text, params) => pool.query(text, params);
