/* global $ */ /* global localStorage */ /* global location */
$(document).ready(function() {
  $(document).on("click", ".addCart", function(e) {
    e.preventDefault();
    //document.querySelector('tableInfo'), 
    //document.querySelector('cartContent tbody');
    console.log("Course added");
    const product = e.target.parentElement.parentElement.parentElement;
    console.log("printing product: ", product);
    const productInfo = {
      id: product.querySelector('#productID').textContent,
      image: product.querySelector('#productImage').alt,
      title: product.querySelector('#productTitle').textContent,
      price: product.querySelector('#productPrice').textContent
    };
    console.log("Product info", productInfo);
    // insert productID into favorites here..
    console.log("adding to favorites..");
    addFavorite(productInfo);
    var addToLocalStorageArray = function(name, value) {

      // Get the existing data
      var existing = localStorage.getItem("productID");

      // If no existing data, create an array
      // Otherwise, convert the localStorage string to an array
      existing = existing ? existing.split(',') : [];

      // Add new data to localStorage Array
      existing.push(productInfo.id);

      // Save back to localStorage
      localStorage.setItem("productID", existing.toString());

    };
    addToLocalStorageArray();
    //console.log(localStorage.getItem("productID").length);

    // $("#cartContent").append(
    //     "<tr>" +
    //          "<td><img src=" + productInfo.image + " width='100'></td>" +
    //          "<td>" + productInfo.title + "</td>" +
    //          "<td>"+ productInfo.price +"</td>" +
    //          "<td> <a href='#' class='remove' data-id="+ ">X</a></td>"+
    //          
    //     "</tr>"
    //          );
    //  
  });
  
  function addFavorite(productInformation){
    console.log("Adding "+ productInformation);
  }

  function displayCart() {
    //let cartItems = localStorage.getItem('productID');
    //console.log(JSON.parse(cartItems));
    if (localStorage.getItem('productID')) {
      let inCart = localStorage.getItem('productID').split(',');
      console.log(inCart);
      inCart.forEach(function(item, i) {
        
        $.ajax({
          method: "GET",
          url: "/api/getProductID",
          dataType: "json",
          data: {
            "id": item,
          },
          success: function(response) {
            console.log("i :", i);
            console.log(response);
            console.log("Response item", response[0].make);
            $("#cartContent").append(
              '<tr>' +
              '<td><img src="' + response[0].pictureURL+ '"width="100"></td>' +
              '<td>' + response[0].make + '</td>' +
              '<td>' + response[0].price + '</td>' +
              '</tr>'
            );
          }
        });
        //$("#cartContent").append(
        //  '<tr>' +
        //  '<td>' + item + '</td>' +
        //  '</tr>'
        //);
      });

    }
    else {
      $("#cartContent").html("Nothing in your cart");
    }
  }
  //let cartItems = localStorage.getItem('productID');
  //console.log(JSON.parse(cartItems));
  displayCart();
  $("#clearCart").on("click", function(e) {
    localStorage.clear();
    location.reload(true);
    // reset table displayed after new search
  });
});
