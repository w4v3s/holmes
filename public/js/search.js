/**
 * Created by andre on 4/8/2017.
 */

var searchPage = false;
$(document).ready(function(){
    $(".title-container").animate({
        top: "-=20vh"
    }, 1000, function() {
        $(".search-container").fadeIn("slow");
    });
});
function search(){
    if (!searchPage){
        $(".search-container").animate({
            top: "30px"
        }, 1000, function() {
        });
        $("#search-bar").animate({
            width: "40vw",
            fontsize:"20px",
            padding:"30px",
        }, 1000, function() {
            searchPage = true;
            $(".article-view").fadeIn("slow");
        });
        $(".title-container").fadeOut("medium");
    }
}