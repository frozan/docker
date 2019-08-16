/*eslint no-undef: "error"*/
/*eslint-env node*/

var mysql = require('mysql');

//Connect to database 
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'pipedrive',
    multipleStatements: true
});

module.exports = connection;