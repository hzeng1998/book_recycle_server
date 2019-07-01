const mysql = require('mysql');
const {promisifyAll} = require('../utils');
const {promisify} = require('util');

let pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'zenghui19980621.',
  database: 'book_recycle',
  port: 3306,
  connectionLimit: 20,
});

pool.query = promisify(pool.query);

pool.getConnectionAsync = promisify(pool.getConnection);

pool.transaction = async (queries, queryValues) => {
  const connection = await pool.getConnectionAsync();
  promisifyAll(connection);
  try {
    await connection.connectAsync();
    await connection.beginTransactionAsync();
    const queryPromises = [];
    queries.forEach((query, index) => {
      queryPromises.push(connection.queryAsync(query, queryValues[index]));
    });
    let results = await Promise.all(queryPromises);
    await connection.commitAsync();
    await connection.releaseAsync();
    return results;
  } catch (e) {
    await connection.rollbackAsync();
    await connection.releaseAsync();
    return e;
  }
};

module.exports = pool;