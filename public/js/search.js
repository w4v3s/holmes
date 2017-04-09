/**
 * Created by andre on 4/8/2017.
 */
//Globals
var searchPage = false;
var secondaries = [];

$(document).ready(function(){
    var a = "I ate a chicken";
    a = a.replace("ate","<b>chicken<\b>");
    console.log(a);

    $(".title-container").animate({
        top: "-=25vh",
        opacity:1.0
    }, 1000, function() {
        $(".title-logo").fadeIn("slow");
        $(".search-container").fadeIn("slow");
    });

    $("#search-bar").keydown(function(event){
        if(event.which=="13")
        {
            searchValues();
        }
    });

    $("#keywords").click(function () {
        $("#notes-panel").hide();
        $("#bibliography").hide();
        $("#keyword-list").show();
        $("#notes").removeClass("notes-selected");
        $("#citation").removeClass("citation-selected");
        $("#keywords").addClass("keywords-selected");
        $(".toolbar-container").removeClass("notes-selected");
        $(".toolbar-container").removeClass("citation-selected");
        $(".toolbar-container").addClass("keywords-selected");
    });
    $("#citation").click(function () {
        $("#notes-panel").hide();
        $("#keyword-list").hide();
        $("#bibliography").show();
        $("#notes").removeClass("notes-selected");
        $("#keywords").removeClass("keywords-selected");
        $("#citation").addClass("citation-selected");
        $(".toolbar-container").removeClass("notes-selected");
        $(".toolbar-container").removeClass("keywords-selected");
        $(".toolbar-container").addClass("citation-selected");
    });
    $("#notes").click(function () {
        $("#keyword-list").hide();
        $("#bibliography").hide();
        $("#notes-panel").show();
        $("#keywords").removeClass("keywords-selected");
        $("#citation").removeClass("citation-selected");
        $("#notes").addClass("notes-selected");
        $(".toolbar-container").removeClass("keywords-selected");
        $(".toolbar-container").removeClass("citation-selected");
        $(".toolbar-container").addClass("notes-selected");
    });

    $(".list-keyword").click(function(){
        $(".list-keyword").removeClass("list-keyword-selected");
        $(this).addClass("list-keyword-selected");
        highlightKeyword($(this).text());
    });
});
function highlightKeyword(word){
    var text = $(".article-text").text();
    console.log(word);
    console.log("1"+text);
    text = text.replace('/word/ig', "<b>"+word+"</b>");
    console.log("2"+text);
    $(".article-text").text(text);
}
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
        searchPage = true;
        $(".title-text").fadeOut("medium");
        $(".title-logo").animate({
            width:"40px",
            top:"20px",
            left:"20px"
        }, 1000, function() {
        });
        $("#logo").animate({
            height: "60px",
            width:"60px"
        }, 1000, function() {
        });
    }
}
function searchValues(){
    console.log("Searching...");
    var searchTerm = $("#search-bar").val();
    getData(searchTerm,true);
    displayArticleView();
}
function getData(term,reset){
    $.ajax({
        type: "POST",
        url: "/search",
        data: {question:term},
        success: function(result){
            var obj = result;
            console.log(obj);
            // setUpArticles(val,reset);
            // setUpSecondary(val,reset);
        },
        error:function(error){
            console.log(error);
            alert("Error! Please reload!");
        }
    });
}
function appendSecondary(obj){
      for(var i=0;i<obj[2].length;i++)
    {
        $("<h2/>", {
            id: 'keyword_'+i,
            html: obj[2][i],
            class:"secondary-question"
        }).appendTo($("secondary-container"));
    }  
}
function appendKeywords(obj){
    
    for(var i=0;i<obj[2].length;i++)
    {
        $("<div/>", {
            id: 'keyword_'+i,
            html: '<h4 class="list-keyword">'+obj[2][i]+'</h4>',
            class:"article"
        }).appendTo($("keyword-list"));
    }
}
function appendArticleList(obj){
    for(var i=0;i<5;i++)
    {
        $("<div/>", {
            id: 'article-entry_'+i,
            html: "<h3 class='article-list-elements article-name'>"+obj[0][i]+"</h3> <h4 class='article-list-elements article-desc'>"+obj[3][i]+"</h4>",
            class:"article"
        }).appendTo($("#article-list-container"));
    }

}
function appendArticle(obj){

    $("<div/>", {
        id: 'article_'+i,
        html: "<h3 class='article-list-elements article-name'>"+obj[0][i]+"</h3> <h4 class='article-list-elements article-desc'>"+obj[3][i]+"</h4> <p class='article-text'></p>",
        class:"article-field article-content"
    }).appendTo($("#article-container"));
    
}
function setUpSecondary(val, reset){
    if(reset){
        $(".secondary-container").clear();
    }
    else if(secondaries.length<5){
        $(".secondary-container").append($("<div class='secondary-question'>"+val+"<\/div>"));
    }
    $(".secondary-question").hover(
        $(this).animate({
        width: "+=30px"
    }, 1000, function() {
    }),$(this).animate({
            width: "-=30px"
        }, 1000, function() {
        }));
    $(".secondary-question").click(function(){
        var searchTerm = $(this).text();
        getData(searchTerm,false);
        $("#search-bar").val(searchTerm);
    });
}
function setUpArticles(val, reset){
    if(reset){
        $(".secondary-container").clear();
    }
    else if(secondaries.length<5){
        $(".secondary-container").append($("<div class='secondary-question'>"+val+"</div>"));
    }
}
function displayArticleView(){
    $(".article-view").fadeIn("slow");
    $(".secondary-container").fadeIn("slow");
}
