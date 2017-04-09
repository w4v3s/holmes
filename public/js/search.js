/**
 * Created by andre on 4/8/2017.
 */
//Globals
var searchPage = false;
var secondaries = [];
var obj;
var array;
var dots;
var noteindex;
$(document).ready(function(){
    $(".title-container").animate({
        top: "-=25vh",
        opacity:1.0
    }, 1000, function() {
        $(".title-logo").fadeIn("slow");
        $(".search-container").fadeIn("slow");
    });

    $("#search-bar").keydown(function(event){
        if(event.which=="13" && searchPage)
        {
            searchBarMove();
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
        $(".list-keyword").click(function (){
            $(".list-keyword").removeClass("list-keyword-selected");
            $(this).addClass("lkselected");
        })
    });


    setupKeywordClick();

    //highlight();
    //notepadMemory();

});
function startLoading(){
    dots = window.setInterval( function() {
        var wait = document.getElementById("wait");
        if ( wait.innerHTML.length > 3 )
            wait.innerHTML = ".";
        else
            wait.innerHTML += ".";
    }, 100);
    $(".loading-view").fadeIn("slow");
}
function stopLoading(){
    clearInterval(dots);
    $(".loading-view").fadeOut("slow");
}
function setupKeywordClick(){
    $(".list-keyword").click(function(){
        $(".list-keyword").removeClass("list-keyword-selected");
        $(this).addClass("list-keyword-selected");
        $('.article-content p').removeHighlight();
        $('.article-content p').highlight($(this).text());
    });
}
function setupSecondaryClick(){
    $(".secondary-question").click(function(){
        var searchTerm = $(this).text();
        $("#search-bar").val(searchTerm);
        $(".secondary-container").fadeOut("slow");
        getData(searchTerm);
    })
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
    getData(searchTerm);
}
function getData(term){
    startLoading();
    $.ajax({
        type: "POST",
        url: "/search",
        data: {question:term},
        success: function(result){
            obj = result;
            console.log(obj);
            resetInfo();
            stopLoading();
            appendArticleList(obj);
            displayArticleView();
            notepadMemory();
        },
        error:function(error){
            console.log(error);
            alert("Error! Please reload!");
        }
    });
}
function resetInfo(){
    $(".secondary-container").empty();
    $("#article-list-container").empty();
    $(".article-content").empty();
    $("#bibliography").empty();
    $("#keyword-list").empty();

}
function appendSecondary(index){
    for(var i=0;i<obj[index].concepts.length;i++)
    {
        $("<h2/>", {
            id: 'tags_'+i,
            html: obj[index].concepts[i],
            class:"secondary-question"
        }).appendTo(".secondary-container");
    }
    setupSecondaryClick();
}
function appendKeywords(index){
    var list = "";
    for(i=0;i<obj[index].keywords.length;i++)
    {
        list+="<h4 class=\"list-keyword\" >"+obj[index].keywords[i]+"<\/h4>";
    }
    $(list).appendTo("#keyword-list");
    setupKeywordClick();
}
function appendArticleList(){
    // 0457

    var list = "";
    for(i=0;i<obj.length;i++){
        list+="<div class=\"article\" onclick=\"openArticle("+i+")\"><h3 class=\"article-list-elements article-name\">" + obj[i].title + "<\/h3>";
        if(obj[i].summary!=null)
            list+="<h4 class=\"article-list-elements article-desc\">" + obj[i].summary + "<\/h4>";
        list+="<div class=\"article-list-elements article-keywords\">";
        if(obj[i].keywords != null && obj[i].keywords.length>1)
        {
            for(a = 0; a<2;a++){
                list+="<h4 class=\"mini-keyword\">"+obj[i].keywords[a]+"</h4>";
            }
        }
        var percen = parseInt(Math.abs(obj[i].sentiment*100));
        console.log(percen);
        if(percen < 1){
            list+="<\/div><div class=\"reliability\" id =\"A"+percen+"\">Not Enough Data to Determine Reliability";
        }
        else {
            list += "<\/div><div class=\"reliability\" id =\"A" + percen + "\">Reliability: ";
        }

        list+="</div></div>";

    }
    $(list).appendTo("#article-list-container");
    $("<div class='main-container'><div class='main-content'><h3 class=\"intro\">click on an article to proceed<\/h3></div></div>").appendTo(".article-content");

    for(c = 0; c<obj.length;c++){
        var percen = parseInt(Math.abs(obj[c].sentiment*100));
        var bar = new ProgressBar.Line("#A"+percen, {
            strokeWidth: 4,
            easing: 'easeInOut',
            duration: 1400,
            color: '#ffca82',
            fill: 'rgba(255, 255, 255, 0.1)',
            trailColor: '#eee',
            trailWidth: 1,
            svgStyle: {width: (percen/2)+"%", height: '100%'}
        });

        bar.animate(1.0);
    }
}
function displayArticleView(){
    $(".article-view").fadeIn("slow");
    $(".secondary-container").fadeIn("slow");
}
function appendBiblio(index){
    $("<h4 class=\"citation\">"+obj[index].bibliography+"<\/h4>").appendTo("#bibliography");
}
function notepadMemory(){
    array=[];
    for(var i=0; i<obj.length;i++)
    {
        array.push("");
    }
}
function updateNotepad(index){
    if(isOverflowed($("#pad")))
    {
        $("#pad").css({
            overflow: 'auto'
        });
    }
    console.log(array);
    $("#pad").val(array[index]);
}
function storeNotes(index){
    array[index]= $("#pad").val();   
}
function initNotes(index){
    $("#pad").off();
    $("#pad").keyup(function(){
        storeNotes(index);
    })
}

function openArticle(index){
    $(".article-content").empty();
    $("#keyword-list").empty();
    $(".secondary-container").empty();
    $("#bibliography").empty();
    initNotes(index);

    var list = "";
    list+="<h2 class=\"article-list-elements article-title article-heading\">"+obj[index].title+"<\/h2>";
    list+="<h2 class=\"article-list-elements article-author article-heading\">";
    if (obj[index].authors != null){
        for(i=0;i<obj[index].authors.length;i++){
            if(i>3){
                list+=" et al...";
                break;
            }
            list+=obj[index].authors[i]+", ";
        }
        list = list.substring(0, list.length - 2);
    }
    list+="<\/h2>"+obj[index].abstract;
    // list+="<div>"
    $(list).appendTo($(".article-content"));

    appendKeywords(index);
    appendSecondary(index);
    appendBiblio(index);
    updateNotepad(index);
}
function isOverflowed(element){
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}   