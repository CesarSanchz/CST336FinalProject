//Constant vairables to use all installed Nodes
const express = require("express");
const app = express();
const request = require("request");
const session = require('express-session')
const pool = require("./dbPool.js");
const bcrypt = require('bcrypt');
var loggedUser= "";
const saltRounds = 10;




//Express use and set declarations
app.set("view engine" , "ejs")

app.use(express.static("public"));

app.use(session({
    secret: "top secret!",
    resave: true,
    saveUninitialized: true
}));

app.use(express.urlencoded({extended: true}));



//routes

//TODO THIS ROUTE SHOULD BE THE LANDING PAGE ROUTE <- DANIEL
app.get("/", function(req, res){
    res.render("index");
});

//Admin Login Get Route
app.get("/login", function(req, res){
    res.render("login");
});

//Admin login POST check route
app.post("/login", async function(req,res){
    let username = req.body.username;
    let password = req.body.password;
    
    let result = await checkUsername(username);
    console.dir(result);
    let hashedPwd = "";
    
    if(result.length > 0){
        hashedPwd=result[0].password;
    }
    
    let passwordMatch = await checkPassword(password, hashedPwd);
    console.log("passwordMatch: " + passwordMatch);

    if (passwordMatch){
        req.session.authenticated = true;
        loggedUser = username
       res.redirect("/adminpage")
    } else {
        res.render("login", {"loginError":true});
    }
})

//Admin Logout route
app.get("/logout", function(req, res){
    req.session.destroy();
    res.redirect("/login");
});

//Admin page route
app.get("/adminpage", isAuthenticated, function(req,res){
    
    let username = loggedUser;
    let sql = "SELECT * FROM product";
    let sql2 = "SELECT * FROM admin";
    let sql3 = "SELECT product.id, product.make FROM favorites JOIN product WHERE product.id = favorites.product_id";
    let sql4 = "SELECT product.id, product.make, Inventory.quantity FROM Inventory JOIN product WHERE product.id = Inventory.product_id";
    pool.query(sql, function (err, rows) {
        if (err) throw err;
        //console.log(rows);
        pool.query(sql2, function (err, rows2) {
            if (err) throw err;
            //console.log(rows2);
            pool.query(sql3, function (err, rows3){
                if (err) throw err;
                pool.query(sql4, function(err, rows4) {
                if (err) throw err;
                //console.log(rows3);
                res.render("adminpage" , {"rows":rows,"rows2":rows2, "rows3":rows3,"rows4":rows4,"username": username});
                });
            });
        });
    });
})

app.get("/api/getProductInfo" , isAuthenticated,function(req, res) {
    let username = loggedUser;
    let productID = [req.query.value]
    let sql ="SELECT * from product WHERE id = ?"
    pool.query(sql, productID, function(err, rows, fields) {
        if(err) throw err;
        console.log(rows);
         res.send(rows);
    })
})


app.get("/addAdmin", isAuthenticated, function(req, res) {
  res.render("addAdmin");
})
app.get("/api/updateProducts", isAuthenticated, function(req, res) {
    let sql = "UPDATE product SET make = ?, model = ?, manufacturer = ?, type = ?, price = ?, description = ?, pictureURL = ? WHERE make = ?"
    let sqlParam = [req.query.make, req.query.model, req.query.manufacturer, req.query.type, req.query.price, req.query.description, req.query.pictureURL, req.query.make];
    console.log(sqlParam)
    pool.query(sql, sqlParam, function (err, rows, fields) {
        if (err) throw err;
        console.log(rows);
        res.render("tableUpdated");
     });
});

app.get("/addProduct", isAuthenticated, function(req, res) {
  res.render("addProduct");
})

app.get("/api/removeAdmin", function(req, res) {
    let sql = "DELETE FROM admin WHERE id = ?";
    let sqlParam = [req.query.value];
    pool.query(sql, sqlParam, function (err, rows, fields) {
        if (err) throw err;
        console.log(rows);
     });
})

app.get("/api/removeFavorite", function(req, res) {
    let sql = "DELETE FROM favorites WHERE product_id = ?";
    let sqlParam = [req.query.value];
    pool.query(sql, sqlParam, function (err, rows, fields) {
        if (err) throw err;
        console.log(rows);
     });
})

app.get("/api/removeProduct", function(req, res) {
    let sql = "DELETE FROM product WHERE id = ?";
    let sqlParam = [req.query.value];
    pool.query(sql, sqlParam, function (err, rows, fields) {
        if (err) throw err;
        console.log(rows);
     });
})

//DATABASE UPDATE ROUTES

//updated admins table
app.get("/api/updateAdmins", async function(req, res){
    let plainPw = req.query.password;
    let hashedPwd = await hashPwd(plainPw);
    console.log(hashedPwd);
    let sql = "INSERT INTO admin (username, password) VALUES (?,?)";
    let sqlParams = [req.query.username, hashedPwd];
    pool.query(sql, sqlParams, function (err, rows, fields) {
      if(err){  //we make sure theres an error (error obj)
        if(err.errno==1062){   
            return res.render('addAdmin',{"loginError":true});
            }
        else{
            throw err;
            }
      }
      console.log(rows);
      res.render("tableUpdated");
    });
});//api/updateAdmins

//updated admins table
app.get("/api/updateProducts", function(req, res){
  let sql;
  let sqlParams;
  sql = "INSERT INTO product (make, model, manufacturer, type, price, description, pictureURL) VALUES (?,?,?,?,?,?,?)";
  sqlParams = [req.query.make, req.query.model, req.query.manufacture, req.query.type, req.query.price, req.query.description, req.query.pictureURL];

  pool.query(sql, sqlParams, function (err, rows, fields) {
    if(err){  //we make sure theres an error (error obj)
        if(err.errno==1062){   
            return res.render('addProduct',{"loginError":true});
            }
        else{
            throw err;
            }
      }
    console.log(rows);
    res.render("tableUpdated");
  });
});//api/updateProducts

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


 function checkPassword(password, hashedValue){
     return new Promise( function(resolve, reject){
       
         bcrypt.compare(password, hashedValue, function(err,res){
             console.log("Result: "+ res);
             resolve(res);
         });
     });
 }
function hashPwd(plainPw){
    
    return new Promise(function(resolve,reject){
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(plainPw, salt);
        console.log(hash)
        resolve(hash);
    })
}
function isAuthenticated(req,res,next){
    if(!req.session.authenticated){
        res.redirect('login');
    } else {
        next();
    }
}

 function checkUsername(username){
     let sql = "SELECT * FROM admin WHERE username = ?"
     return new Promise(function(resolve, reject){
             pool.query(sql,[username], function(err, rows,fields){
                 if(err) throw err;
                 //console.log("Rows found: " + rows.length);
                 resolve(rows);
             });//query
     })//promise
 }
//start server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Express server is running...");
});


//THESE GETS WERE USED TO DISPLAY ALL DATABASE INFO TODO -> REMOVE
/**
app.get("/search",  function(req, res) {
  let sql = "SELECT * FROM product";
  pool.query(sql, function (err, rows, fields) {
     if (err) throw err;
     console.log(rows);
     res.render("adminpage" , {"rows":rows});
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
app.get("/favorites",  function(req, res) {
  let sql = "SELECT product.make FROM favorites JOIN product WHERE product.id = favorites.product_id";
  pool.query(sql, function (err, rows, fields) {
     if (err) throw err;
     console.log(rows);
     res.render("favorites" , {"rows":rows});
  });  
});//search
app.get("/inventory",  function(req, res) {
  let sql = "SELECT product.make, Inventory.quantity FROM Inventory JOIN product WHERE product.id = Inventory.product_id";
  pool.query(sql, function (err, rows, fields) {
     if (err) throw err;
     console.log(rows);
     res.render("inventory" , {"rows":rows});
  });  
});//search
**/