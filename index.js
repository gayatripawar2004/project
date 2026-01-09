var express = require("express");
var upload = require("express-fileupload")
var bodyparser = require("body-parser");
var user_routes = require("./Router/user");
var admin_routes = require("./Router/admin");
var upload = require("express-fileupload");
var url = require("url");
var session = require("express-session")


var app = express();
app.use(upload());

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public/"));
app.use(session({
    resave:true,
    saveUninitialized:true,
    secret:"a2zithub"
}));

app.use("/", user_routes);
app.use("/admin", admin_routes);


app.get("/",function(req,res){
    res.render("user/index.ejs")
})

app.listen(1000);