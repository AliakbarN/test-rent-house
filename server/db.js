require('dotenv').config()
const Pool = require('pg').Pool;

const pool = new Pool({
    host: process.env['DB_HOST'] || 'localhost',
    port: process.env['DB_PORT'] || 5432,
    database: process.env['DB_DATABASE'] || 'testdb',
    user: process.env['DB_USER'] || 'postgres',
    password: process.env['DB_PASSWORD'] || 'admin001'
})

module.exports = pool;