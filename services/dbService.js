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
  return result.length > 0 ? result[0].thread_id : null;
}

async function createUserThread(userid, threadId) {
  const queryText = 'INSERT INTO user_threads (user_id, thread_id) VALUES ($1, $2)';
  const queryParams = [userid, threadId];
  await queryDatabase(queryText, queryParams);
}

module.exports = {
  fetchThreadByUserid
};
