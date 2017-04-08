/**
 * Created by andre on 4/8/2017.
 */

var searchPage = false;
$(document).ready(function(){

    $(".title-container").animate({
        top: "-=20vh",
        opacity:1.0
    }, 1000, function() {
        $(".search-container").fadeIn("slow");
    });

    $("#search-bar").keydown(function(event){
        if(event.which=="13")
        {
            searchValues();
        }
    });
});
function searchBarMove(){
    if (!searchPage){
        $(".search-container").animate({
            top: "30px"
        }, 1000, function() {
        });
        $("#search-bar").animate({
            width: "40vw",
            padding:"30px"
        }, 1000, function() {
        });
        $(".div-container").fadeIn("medium")
        searchPage = true;
        $(".title-container").fadeOut("medium");
    }
}
function searchValues(){
    console.log("Searching...");
    var searchTerm = $("#search-bar").val();
    getData(searchTerm);
}
function getData(term){
    $.ajax({
        type: "POST",
        url: "/search",
        data: {question:term},
        success: function(result){
            var obj = result;
            console.log(result);
        },
        error:function(error){
            console.log(error);
        }
    });
}
function displayArticle(){
    $(".article-view").fadeIn("slow");
    $(".secondary-container").fadeIn("slow");
}