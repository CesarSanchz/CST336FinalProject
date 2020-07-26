const express = require("express");
const app = express();
const request = require("request");
const pool = require("./dbPool.js");

app.set("view engine" , "ejs")
app.use(express.static("public"));

//routes
app.get("/", function(req, res){
    res.render("index");
});

app.get("/search",  function(req, res) {
  let sql = "SELECT * FROM product";
  pool.query(sql, function (err, rows, fields) {
     if (err) throw err;
     console.log(rows);
     res.render("results" , {"rows":rows});
  });  
});//search

app.get("/admins",  function(req, res) {
  let sql = "SELECT * FROM admin";
  pool.query(sql, function (err, rows, fields) {
     if (err) throw err;
     console.log(rows);
     res.render("admins" , {"rows":rows});
  });  
});//search
app.get("/cart",  function(req, res) {
  let sql = "SELECT * FROM cart";
  pool.query(sql, function (err, rows, fields) {
     if (err) throw err;
     console.log(rows);
     res.render("cart" , {"rows":rows});
  });  
});//search
app.get("/inventory",  function(req, res) {
  let sql = "SELECT * FROM Inventory";
  pool.query(sql, function (err, rows, fields) {
     if (err) throw err;
     console.log(rows);
     res.render("inventory" , {"rows":rows});
  });  
});//search

app.get("/api/updateAdmins", function(req, res){
  let sql;
  let sqlParams;
  sql = "INSERT INTO admin (username, password) VALUES (?,?)";
  sqlParams = [req.query.username, req.query.password];

  pool.query(sql, sqlParams, function (err, rows, fields) {
    if (err) throw err;
    console.log(rows);
    res.render("tableUpdated");
  });
});//api/updateAdmins

app.get("/api/updateProducts", function(req, res){
  let sql;
  let sqlParams;
  sql = "INSERT INTO product (name, manufacture, type, price, description, pictureURL) VALUES (?,?,?,?,?,?)";
  sqlParams = [req.query.name, req.query.manufacture, req.query.type, req.query.price, req.query.description, req.query.pictureURL];

  pool.query(sql, sqlParams, function (err, rows, fields) {
    if (err) throw err;
    console.log(rows);
    res.render("tableUpdated");
  });
});//api/updateProducts

app.get("/api/updateCart", function(req, res){
  let sql;
  let sqlParams;
  sql = "INSERT INTO cart (product_id, quantity) VALUES (?,?)";
  sqlParams = [req.query.product_id, req.query.quantity];

  pool.query(sql, sqlParams, function (err, rows, fields) {
    if (err) throw err;
    console.log(rows);
    res.render("tableUpdated");
  });
});//api/updateCart

app.get("/api/updateInventory", function(req, res){
  let sql;
  let sqlParams;
  sql = "INSERT INTO Inventory (product_id, quantity) VALUES (?,?)";
  sqlParams = [req.query.product_id, req.query.quantity];

  pool.query(sql, sqlParams, function (err, rows, fields) {
    if (err) throw err;
    console.log(rows);
    res.render("tableUpdated");
  });
});//api/updateInventory

//start server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Express server is running...");
});