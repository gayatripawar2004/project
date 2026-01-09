var mysql = require("mysql2");
var util = require("util");
var url = require("url");


const conn = mysql.createConnection({
    host: "bvnwnxrjubndyganmsk3-mysql.services.clever-cloud.com",
    user: "upe7ynlw69vnbgct",
    password: "4Bnp6ORPxOBK2ttkrDU0",
    database: "bvnwnxrjubndyganmsk3",
   
})
const exe = util.promisify(conn.query).bind(conn);


module.exports = exe;
