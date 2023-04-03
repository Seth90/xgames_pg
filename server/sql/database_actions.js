const { Pool } = require('pg');

module.exports = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'xgames',
    password: '',
    port: 5432,
    max: 20,
    idleTimeoutMillis: 60000,
    connectionTimeoutMillis: 20000,
});



/* client.connect((err) => {
   if (err) {
     console.error('connection error', err.stack)
   } else {
     console.log('connected')
   }
 })
const text = 'INSERT INTO test(id, title, description) VALUES($1, $2, $3) RETURNING *'
*/

/*const values = ['31b1r22ianc1', 'brian.m.22carlson@gmail.com', '12223',]
client
  .query(text, values)
  .then(res => {
    console.log(res.rows)
    // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
    client.end()
  })
  .catch(e => {console.error(e.stack); client.end()})
*/
