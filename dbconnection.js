const mysql = require('mysql');
const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'sis_community_system',
    multipleStatements:true
})

module.exports.connection  = connection

/* 
connect--> object name this can be imported by another module.
connection means connection object.
*/