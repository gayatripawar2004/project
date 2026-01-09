var express = require("express");
var route = express.Router();
var exe = require("./../connection");


route.get("/",function(req,res){
    res.render("admin/index.ejs");
})

route.get("/login",function(req,res){
    res.render("admin/login.ejs")
})

route.get("/about",async function(req,res){
    var data = await exe(`SELECT * FROM about_company`);
    var obj = {"about_company":data}
    res.render("admin/about.ejs",obj);
})

route.post("/abou_company", async function(req,res){
    var d = req.body;
    var sql = `UPDATE about_company SET
    company_name = '${d.company_name}',
    company_mobile = '${d.company_mobile}',
    company_email = '${d.company_email}',
    company_whatsapp = '${d.company_whatsapp}',
    comapany_address = '${d.comapany_address}',
    insta = '${d.insta}',
    youtube = '${d.youtube}',
    telegram = '${d.telegram}'
    `
    var data = await exe(sql);
    
    res.redirect("/admin/about");
    
    res.send(req.body);
})

route.get("/slider",async function(req,res){
    var data = await exe(`SELECT * FROM slider`);
    var obj = {"list":data}
    res.render("admin/slider.ejs",obj)
})
route.post("/slider",async function(req,res){
    var d = req.body;
    if(req.files){
        var FileName = Date.now()+req.files.image.name;
        req.files.image.mv("public/"+FileName);
    }
    var sql = `INSERT INTO slider(title,details,btn_text,btn_url,image)
    VALUES
    ('${d.title}','${d.details}','${d.btn_text}','${d.btn_url}','${FileName}')`
    var data = await exe(sql);
    res.redirect("/admin/slider")
    // res.send(sql);
})

route.get("/slider/delete/:id",async function(req,res){
    var d = req.params.id;
    var data = await exe(`DELETE FROM slider WHERE id = '${d}'`)
    res.redirect("/admin/slider")
})

route.get("/slider/update/:id", async function(req, res) {
    var d = req.params.id;
    var data = await exe(`SELECT * FROM slider WHERE id = '${d}'`);
    var obj = {"slider":data}

    res.render("admin/update_slider.ejs",obj);
});

route.post("/slider/update",async function(req,res){
    var d = req.body;
    var FileName = d.old_image;

    if (req.files && req.files.image) {
        FileName = Date.now() + req.files.image.name;
        req.files.image.mv("public/" + FileName);
    }

    var sql = `UPDATE slider SET 
       title = '${d.title}',
       details = '${d.details}',
       btn_text = '${d.btn_text}',
       btn_url = '${d.btn_url}',
       image = '${FileName}'
       WHERE 
       id =  '${d.id}'`
       var data = await exe(sql);
       res.redirect("/admin/slider")
})

route.get("/category",async function(req,res){
    var categary = await exe(`SELECT * FROM categary`)
    var obj = {"categary":categary}
    res.render("admin/category.ejs",obj)
})

route.post("/save_catagory",async function(req,res){
    var data = await exe(`INSERT INTO categary(categary_name) VALUES ('${req.body.categary_name}')`)
    res.redirect("/admin/category")
    // res.send(data);
})
    
route.get("/categary/delete/:id", async function (req, res) {
    let id = req.params.id;
    await exe(`DELETE FROM categary WHERE categary_id='${id}'`);
    res.redirect("/admin/category");
});

route.get("/categary/update/:id", async function(req, res) {
    var id = req.params.id;
    var categary = await exe(`SELECT * FROM categary WHERE categary_id='${id}'`);
    res.render("admin/update_categary.ejs", { categary });
});


route.post("/categary/update", async function(req,res) {   
    await exe(`UPDATE categary 
               SET categary_name = '${req.body.categary_name}'
               WHERE categary_id = '${req.body.categary_id}'`);

               res.redirect("/admin/category");
});

route.get("/add_product",async function(req,res){
    var categary = await exe(`SELECT * FROM categary`)
    var obj = {"categary":categary}
    res.render("admin/add_product.ejs",obj)
})

route.post("/save_product", async function (req, res) {

    
    if (req.files && req.files.product_image_1) {
     var product_image_1 = Date.now() + req.files.product_image_1.name;
        req.files.product_image_1.mv("public/upload/" + product_image_1);
    }

    
    if (req.files && req.files.product_image_2) {
     var product_image_2 = Date.now() + req.files.product_image_2.name;
        req.files.product_image_2.mv("public/upload/" + product_image_2);
    }


    if (req.files && req.files.product_image_3) {
    var product_image_3 = Date.now() + req.files.product_image_3.name;
        req.files.product_image_3.mv("public/upload/" + product_image_3);
    }else{
       var  product_image_3 =""
        
    }

    
    if (req.files && req.files.product_image_4) {
     var product_image_4 = Date.now() + req.files.product_image_4.name;
        req.files.product_image_4.mv("public/upload/" + product_image_4);
    }else{
       var  product_image_4 =""
    }
    
    var d = req.body;
    

    
    var sqlProduct = `
        INSERT INTO product(
        categary_id, product_name, product_company, colors,
        product_label, product_detail, image_1, image_2, image_3, image_4
        ) VALUES (?,?,?,?,?,?,?,?,?,?)`;

    var data = await exe(sqlProduct, [
        d.categary_id,
        d.product_name,
        d.product_company,
        d.colors,
        d.product_label,
        d.product_detail,
        product_image_1,
        product_image_2,
        product_image_3,
        product_image_4
    ]);

    var product_id = data.insertId;
    
    
  for(var i = 0; i < d.sizes.length;i++){
        var sql1 =`INSERT INTO product_pricing (product_id,productL_size,real_prize,duplicate_prize)
              VALUES ('${product_id}','${ d.sizes[i]}','${d.real_prize[i]}','${ d.duplicate_prize[i]}')` 

     var data1 = await exe(sql1);
 }
    // res.send(req.body);
    
    res.redirect("/admin/product_list");

    

});

route.get("/product_list", async function(req,res){
    var data = await exe(`SELECT * FROM product`)
    var sql = `SELECT *,
    (SELECT MIN(real_prize) FROM product_pricing 
    WHERE product.product_id = product_pricing.product_id)
    AS price,
    
    (SELECT MAX(duplicate_prize) FROM product_pricing
    WHERE product.product_id = product_pricing.product_id) 
    AS product_duplicate_price
    FROM product`
    var data1 = await exe(sql);
    var obj = {"product_info":data1}
    
    res.render("admin/product_list.ejs",obj)
});

route.get("/delete_product/:id",async function(req,res){
    var id = req.params.id;
    var data = await exe(`DELETE FROM product WHERE product_id = '${id}'`)
    // res.send(data)
    res.redirect("/admin/product_list")
})

route.get("/view_project/:id",async function(req,res){
    var id = req.params.id;
     var data = await exe(`
        SELECT p.*, c.categary_name 
        FROM product p 
        LEFT JOIN categary c 
        ON p.categary_id = c.categary_id
        WHERE p.product_id = '${id}'
    `);
    var data1 = await exe(`SELECT * FROM product_pricing WHERE product_id = '${id}'`);
    var obj = {"product_view":data[0],"product_pricing_view":data1}
    // res.send(data1);
    res.render("admin/project_view.ejs",obj);
})

route.get("/orders_list/:status",async function(req,res){
    var status = req.params.status;
    var sql = `SELECT * FROM order_tbl WHERE order_status = '${status}'`
    var data = await exe(sql);
    var obj = {"status":status,"orders":data}
    // res.send(data)
    res.render("admin/order_list.ejs",obj)
})


route.get("/order_info/:order_id",async function(req,res){
  // res.send(req.params.order_id);
  var sql = `SELECT * FROM order_tbl WHERE order_id = '${req.params.order_id}'`;
  var order_data = await exe(sql);
  var sql1 = `SELECT * FROM order_det WHERE order_id = '${req.params.order_id}'
   AND customer_id = '${req.session.user_id}'`;
  var order_det = await exe(sql1);
    var obj = {"order_data":order_data,"order_det":order_det}
  res.render("admin/order_info.ejs",obj)
})

route.get("/transper_order/:order_id/:status",async function(req,res){
    var status = req.params.status;
    var order_id = req.params.order_id;
    
    var today = new Date().toISOString().slice(0,10);
    
    if(status == 'cancelled')
        var sql = `UPDATE order_tbl SET order_status = '${status}',cancelled_date = '${today}' WHERE order_id ='${order_id}'`
    else if(status == 'rejected')
         var sql = `UPDATE order_tbl SET order_status = '${status}',rejected_date = '${today}' WHERE order_id ='${order_id}'`
    else if(status == 'returned')
         var sql = `UPDATE order_tbl SET order_status = '${status}',returned_date = '${today}' WHERE order_id ='${order_id}'`
    else if(status == 'delivered')
         var sql = `UPDATE order_tbl SET order_status = '${status}',delivered_date = '${today}' WHERE order_id ='${order_id}'`
    else if(status == 'dispatched')
         var sql = `UPDATE order_tbl SET order_status = '${status}',dispatched_date = '${today}' WHERE order_id ='${order_id}'`
    
    
    var data = await exe(sql);
        
    // res.send(data);
    res.redirect("/admin/order_list/" +status)
})




module.exports = route;

// product_id INT PRIMARY KEY auto_increment,
// categary_id INT,
// product_name VARCHAR(100),
// product_company VARCHAR(100),
// colors VARCHAR(100),
// product_label VARCHAR(100),
// product_detail VARCHAR(100),
// image_1 TEXT,
// image_2 TEXT,
// image_3 TEXT,
// image_4 TEXT

// CREATE TABLE product_pricing (
// product_pricing_id INT PRIMARY KEY AUTO_INCREMENT,
// product_id INT,
// productL_size VARCHAR(100),
// real_prize INT,
// duplicate_prize INT );
