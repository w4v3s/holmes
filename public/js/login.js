/**
 * Created by Andrew Wang on 5/15/2017.
 */

$(document).ready(function () {
    $(".login-tab").click(function(){
        $(".login-tab").removeClass("selected");
        $(this).addClass("selected");
        $(".login-bars").hide();
        console.log($(this).text());
        $("#"+$.trim($(this).text())).fadeIn();
    });
});