import { HttpFunction } from '@google-cloud/functions-framework';
import mysql from 'promise-mysql';
import { readFileSync } from 'fs';

const createTcpPool = async (config: any) => {
  // Establish a connection to the database
  return await mysql.createPool({
    host: process.env.DB_HOST, // e.g. 'my-db-host'
    user: process.env.DB_USER, // e.g. 'my-db-user'
    password: process.env.DB_PASS, // e.g. 'my-db-password'
    database: process.env.DB_NAME, // e.g. 'my-database'
    ssl: {}, // needed to trigger TLS connection
    ...config,
  });
};

const createPool = async () => {
  const config = {
    // [START cloud_sql_mysql_mysql_limit]
    // 'connectionLimit' is the maximum number of connections the pool is allowed
    // to keep at once.
    connectionLimit: 5,
    // [END cloud_sql_mysql_mysql_limit]

    // [START cloud_sql_mysql_mysql_timeout]
    // 'connectTimeout' is the maximum number of milliseconds before a timeout
    // occurs during the initial connection to the database.
    connectTimeout: 10000, // 10 seconds
    // 'acquireTimeout' is the maximum number of milliseconds to wait when
    // checking out a connection from the pool before a timeout error occurs.
    acquireTimeout: 10000, // 10 seconds
    // 'waitForConnections' determines the pool's action when no connections are
    // free. If true, the request will queued and a connection will be presented
    // when ready. If false, the pool will call back with an error.
    waitForConnections: true, // Default: true
    // 'queueLimit' is the maximum number of requests for connections the pool
    // will queue at once before returning an error. If 0, there is no limit.
    queueLimit: 0, // Default: 0
    // [END cloud_sql_mysql_mysql_timeout]

    // [START cloud_sql_mysql_mysql_backoff]
    // The mysql module automatically uses exponential delays between failed
    // connection attempts.
    // [END cloud_sql_mysql_mysql_backoff]
  };
  return await createTcpPool(config);
};

const ensureSchema = async (pool: any) => {
  // If you need to create initial tables, do it here. E.g.,
  // await pool.query(
  //   `CREATE TABLE IF NOT EXISTS votes
  //     ( vote_id SERIAL NOT NULL, time_cast timestamp NOT NULL,
  //     candidate CHAR(6) NOT NULL, PRIMARY KEY (vote_id) );`
  // );
  console.log("Ensured that required tables exist");
};

const createPoolAndEnsureSchema = async () =>
  await createPool()
    .then(async pool => {
      await ensureSchema(pool);
      return pool;
    })
    .catch(err => {
      console.log(err);
      throw err;
    });

// Set up a variable to hold our connection pool. It would be safe to
// initialize this right away, but we defer its instantiation to ease
// testing different configurations.
let pool: any;

export const dgl_be: HttpFunction = async (req, res) => {
  pool = pool || (await createPoolAndEnsureSchema());
  let results: any;
  results = await pool.query('select * from pet');
  let body = '<table><tr><th>Pet Names</th></tr>';
  for ( const row of results ) {
    body += `<tr><td>${row['name']}</td></tr>`;
  }
  res.send( body );
}
