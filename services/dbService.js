// services/dbService.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function queryDatabase(queryText, queryParams) {
  const client = await pool.connect();
  try {
    const result = await client.query(queryText, queryParams);
    return result.rows;
  } finally {
    client.release(); // Always release the client
  }
}

async function fetchThreadByUserid(userid) {
  const queryText = 'SELECT thread_id FROM user_threads WHERE user_id = $1';
  const queryParams = [userid];
  const result =  await queryDatabase(queryText, queryParams);
  return result.rows.length > 0 ? result.rows[0].thread_id : null;
}

module.exports = {
  fetchThreadByUserid
};
