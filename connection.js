var mysql = require("mysql2");
var util = require("util");
var url = require("url");


const conn = mysql.createConnection({
    host: "bfb15wq8xz61ryiwmzjy-mysql.services.clever-cloud.com",
    user: "uxbf3ihdvnnnaonr",
    password: "uxbf3ihdvnnnaonr",
    database: "bfb15wq8xz61ryiwmzjy",
   
})
const exe = util.promisify(conn.query).bind(conn);


module.exports = exe;