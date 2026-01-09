var mysql = require("mysql2");
var util = require("util");
var url = require("url");


const conn = mysql.createConnection({
    host: "brf19hafnfydg8pmajkn-mysql.services.clever-cloud.com",
    user: "u6bettqiyq4f6oqe",
    password: "0sjVSGaEDIsusg5ayLXE",
    database: "brf19hafnfydg8pmajkn",
   
})
const exe = util.promisify(conn.query).bind(conn);


module.exports = exe;
