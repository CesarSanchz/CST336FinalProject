$(document).ready(function() {
    // console.log("starting favorites functions");
    // Function will populate the front index page with a list of three favorite items
    $.ajax({
       method:  "GET",
       url:     "/api/getFavorites",
       dataType:"json",
       success: function(result, status) {
            $("#favoriteItemType1").html("<p>"+result[0].type+"</p>");
            $("#favoriteItemMan1").html("<p>"+result[0].manufacturer+"</p>");
            $("#favoriteItemDesc1").html("<p>"+result[0].description+"</p>");
            $("#favoriteItemFoto1").html("<br><br><img src="+result[0].pictureURL+" alt='Computer Component' width='70' height='70'><br>");
            $("#favoriteItemType2").html("<p>"+result[1].type+"</p>");
            $("#favoriteItemMan2").html("<p>"+result[1].manufacturer+"</p>");
            $("#favoriteItemDesc2").html("<p>"+result[1].description+"</p>");
            $("#favoriteItemFoto2").html("<br><br><img src="+result[1].pictureURL+" alt='Computer Component' width='70' height='70'>");
            $("#favoriteItemType3").html("<p>"+result[2].type+"</p>");
            $("#favoriteItemMan3").html("<p>"+result[2].manufacturer+"</p>");
            $("#favoriteItemDesc3").html("<p>"+result[2].description+"</p>");
            $("#favoriteItemFoto3").html("<br><br><img src="+result[2].pictureURL+" alt='Computer Component' width='70' height='70'>");
       }
    });
});