/**
 * Created by andre on 4/8/2017.
 */
//Required attributes
var express = require('express');
var $ = require('jquery');
var http = require('http');
var fs = require('fs');

//Global
var bluemix = {
    "url": "https://gateway.watsonplatform.net/natural-language-understanding/api",
    "username": "f40b006b-21d1-4e33-862b-466ab1c87653",
    "password": "Kaj1Y4jfaQm1"
};
var aylien_key = "bd308ed5f3710b40d6e280fafd4d222e";
var aylien_app_id = "5ceffad9";

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

/*Setup*/
var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

var nlu = new NaturalLanguageUnderstandingV1({
    username: bluemix.username,
    password: bluemix.password,
    version_date: NaturalLanguageUnderstandingV1.VERSION_DATE_2017_02_27
});

var AYLIENTextAPI = require('aylien_textapi');
var textapi = new AYLIENTextAPI({
    application_id: aylien_app_id,
    application_key: aylien_key
});

/*Examples*/
nlu.analyze({
    'html': file_data, // Buffer or String
    'features': {
        'concepts': {},
        'keywords': {},
        'sentiment':{},
        'emotion':{},
        'categories':{}
    }
}, function(err, response) {
    if (err)
        console.log('error:', err);
    else
        console.log(JSON.stringify(response, null, 2));
});

textapi.summarize({
    url: 'http://techcrunch.com/2015/04/06/john-oliver-just-changed-the-surveillance-reform-debate',
    sentences_number: 1
}, function(error, response) {
    if (error === null) {
        response.sentences.forEach(function(s) {
            console.log(s);
        });
    }
});


app.post('/search', function(request, response) {
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