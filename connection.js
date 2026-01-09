var mysql = require("mysql2");
var util = require("util");
var url = require("url");


const conn = mysql.createConnection({
    host: "biqjfwbz5jhs07fvv6tl-mysql.services.clever-cloud.com",
    user: "uefxtpwsnlm5v3vy",
    password: "IoPqwnodnx9kZj9VYdo4",
    database: "biqjfwbz5jhs07fvv6tl",
   
})
const exe = util.promisify(conn.query).bind(conn);


module.exports = exe;
