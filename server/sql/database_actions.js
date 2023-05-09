const { Pool } = require('pg');
 
module.exports = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'xgames',
    password: 'goaldemo',
    port: 5432,
    max: 20,
    idleTimeoutMillis: 60000,
    connectionTimeoutMillis: 20000,
});