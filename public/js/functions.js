/* global $ */
$(document).ready(function(){

let productToUpdate = "";


$('#showProducts').on('click',function(){   
  var x = document.getElementById("products");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
   });
   
  $('#showAdmins').on('click',function(){   
  var x = document.getElementById("admins");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
   });

$('#showFavorites').on('click',function(){   
  var x = document.getElementById("favorites");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
   });
   
   $('#showInventory').on('click',function(){   
  var x = document.getElementById("inventory");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
   });
   
   
   $('.removeAdmin').on('click',function(){
       if(confirm("Are you sure you want to delete this record?")){
          alert("DatabaseUpdated");
          let adminID =(this).value;
          removeAdmin(adminID);
          window.location.href=window.location.href
       }
   });
       
    $('.changeProduct').on('click', function() {
        productToUpdate= (this).value;
        getProductInfo(productToUpdate);
        var x = document.getElementById("updateProductFrom");
       x.style.display = "block";
        
    })
    
    function getProductInfo(value){
        $.ajax({
            mehtod: "get",
            url: "/api/getProductInfo",
            data: {
                "value":value
            },
            success: function(data, success){
                console.log("succecc")
                data.forEach(function(row){
                    $("#make").val(row.make);
                    $("#model").val(row.model);
                    $("#manufacturer").val(row.manufacturer);
                    $("#type").val(row.type);
                    $("#price").val(row.price);
                    $("#description").val(row.description);
                    $("#pictureURL").val(row.pictureURL);
                })
               
            }
        })
    }
    
    
    function removeAdmin(value){
        $.ajax({
            method: "get",
            url: "/api/removeAdmin",
            data : {
                "value":value
            },
            success: function(data, satus){

            }
        });//ajax
       }
       
    $('.removeFavorite').on('click',function(){
       if(confirm("Are you sure you want to delete this record?")){
          alert("DatabaseUpdated");
          let favoriteID =(this).value;
          console.log(favoriteID);
          removeFavorite(favoriteID);
          window.location.href=window.location.href
       }
   });
       
      
    function removeFavorite(value){
        $.ajax({
            method: "get",
            url: "/api/removeFavorite",
            data : {
                "value":value
            },
            success: function(data, satus){
            }
        });//ajax
       }
       
    $('.removeProduct').on('click',function(){
       if(confirm("Are you sure you want to delete this record?")){
          alert("DatabaseUpdated");
          let productID =(this).value;
          console.log(productID);
          removeProduct(productID);
          window.location.href=window.location.href
       }
   });
       
      
    function removeProduct(value){
        $.ajax({
            method: "get",
            url: "/api/removeProduct",
            data : {
                "value":value
            },
            success: function(data, satus){
            }
        });//ajax
       }
});