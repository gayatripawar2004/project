var mysql = require("mysql2");
var util = require("util");
var url = require("url");


const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "nodejs_project",
    port: "3307"
})
const exe = util.promisify(conn.query).bind(conn);


module.exports = exe;