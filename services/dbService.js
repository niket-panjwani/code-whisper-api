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
  return await queryDatabase(queryText, queryParams);
}

module.exports = {
  fetchThreadByUserid
};
