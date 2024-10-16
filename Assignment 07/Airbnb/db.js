const http = require('http');
const mysql = require('mysql2');

const pool =

    mysql.createConnection(
        {
            host: "localhost",
            database: "airbnb_db",
            port: 3306,
            user: "KD2_mrunali_86706",
            password: "Manager"
        });


module.exports = { pool };
