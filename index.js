/**
 * Created by andre on 4/8/2017.
 */
//Required attributes
var express = require('express');
var $ = require('jquery');
var http = require('http');

//Global


var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

/*
 //CORS Setup
 app.use(function(req, res, next) {
 res.header("Access-Control-Allow-Origin", "*");
 res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 next();
 });
 */

app.post('/newssources', function(request, response) {
    request.on("data",function(chunk){
        var str = ''+chunk;
        var category = "music";
        var language = "en";
        var country = "us";

        var options = {
            host: 'newsapi.org',
            method: 'GET',
            path: '/v1/sources?category='+category+'&language='+language+'&country='+country
        };
        callback = function(res) {
            var str = '';
            res.on('data', function (c) {
                str += c;
            });
            res.on('end', function () {
                response.send(str);
            });
        };
        http.request(options, callback).end();
    });
});

app.post('/newsarticles', function(request, response) {
    request.on("data",function(chunk){
        var str = ''+chunk;
        var source= "cnn";

        var options = {
            host: 'newsapi.org',
            method: 'GET',
            path: '/v1/articles?apiKey='+apiKey+'&source='+source
        };
        callback = function(res) {
            var str = '';
            res.on('data', function (c) {
                str += c;
            });
            res.on('end', function () {
                response.send(str);
            });
        };
        http.request(options, callback).end();
    });
});

app.post('/default', function(request, response) {
    request.on("data",function(chunk){
        console.log('TEST COMPLETE');
        response.send("Server Works");
    });
});

//Runs app
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});