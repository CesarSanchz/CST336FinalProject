/* global $ */
$(document).ready(function() {

  function search() {
    var make = $("#make").val();
    var manufacturer = $("#manufacturer").val();
    var partType = $("#partType").val();
    console.log("make: ", make);
    console.log("manufacturer: ", manufacturer);
    console.log("partType: ", partType);
    $.ajax({
      method: "GET",
      url: "/api/getAllProduct",
      dataType: "json",
      data: {
        "make": make,
        "manufacturer": manufacturer,
        "partType": partType,
      },
      success: function(response) {
        // Validation for input field
        $("#displayTable").append(
          "<table>" +
          "<tr>" +
          "<th> ID </th>" +
          "<th> Picture </th>" +
          "<th> Make </th>" +
          "<th> Model </th>" +
          "<th> Manufacturer </th>" +
          "<th> Type </th>" +
          "<th> Price </th>" +
          "</tr>" +
          "</table>"
        );
        for (var i = 0; i < response.length; i++) {
          $("#displayTable").append(
            "<div>" +
            "<table>" +
            "<tr class='tableInfo' value='" + response[i].id + "'>" +
            " <td><h3 id='productID'>" + response[i].id + "</h3></td> " +
            " <td><img id='productImage' alt='" + response[i].pictureURL + "' src='" + response[i].pictureURL + "' width='200' height='200'></td>" +
            " <td><h3 id='productTitle'>" + response[i].make + "</h3></td> " +
            " <td><h3>" + response[i].model + "</h3></td> " +
            " <td><h3>" + response[i].manufacturer + "</h3></td> " +
            " <td><h3>" + response[i].type + "</h3></td> " +
            " <td><h3 id='productPrice' >" + response[i].price + "</h3></td> " +
            "<td><button class ='addCart' value ='" + response[i].id + "'> Add to Cart </td>" +
            "</tr>" +
            "</table>" +
            "</div>"
          );
        }

        //$("#displayTable").html("results for " + response[0].make);
      }

    });
  }


  $("#btnSearch").on("click", function(e) {
    e.preventDefault();
    search();
    $("#displayTable").html("");
    // reset table displayed after new search
  });
});
