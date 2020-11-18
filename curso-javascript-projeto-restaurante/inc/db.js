const mysql = require('mysql2')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'caio123',
    database: 'saboroso',
    password: 'caio123',
    multipleStatements: true
})

module.exports = connection

