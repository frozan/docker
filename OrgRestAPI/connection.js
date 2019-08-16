/*eslint no-undef: "error"*/
/*eslint-env node*/

var mysql = require('mysql');

//Connect to database 
const connection = mysql.createPool({
    host: '192.168.99.100',
    user: 'root',
    password: '',
    insecureAuth: true,
    database: 'pipedrive',
});

module.exports = connection;