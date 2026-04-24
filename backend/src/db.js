const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://emoji:emoji@localhost:5432/emoji_store',
});

module.exports = { pool };
