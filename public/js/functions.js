/* global $ */
$(document).ready(function(){

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
      let adminID =(this).value;
      removeAdmin(adminID);
   });
       
      
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
});