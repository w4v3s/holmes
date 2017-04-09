/**
 * Created by andre on 4/8/2017.
 */

console.log('starting');
//Required attributes
var $ = require('jquery');
var request = require('request');
var express = require('express');
var http = require('http');
var fs = require('fs');
var Bing = require('node-bing-api');
var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
var AYLIENTextAPI = require('aylien_textapi');
//Global
// var bluemix = {
//     "url": "https://gateway.watsonplatform.net/natural-language-understanding/api",
//     "username": "f40b006b-21d1-4e33-862b-466ab1c87653",
//     "password": "Kaj1Y4jfaQm1"
// };
// var bluemix = {
//   "url": "https://gateway.watsonplatform.net/natural-language-understanding/api",
//   "username": "8153d2f9-2710-41c0-b60b-1dcad89ccc77",
//   "password": "Yw44Q17hJe1q"
// };
// var bluemix = {
//       "url": "https://gateway.watsonplatform.net/natural-language-understanding/api",
//       "username": "33169e80-2b23-428f-94d1-1bd35558538c",
//       "password": "IuUo24iXQTxT"
// }
// var bluemix = {
//   "url": "https://gateway.watsonplatform.net/natural-language-understanding/api",
//   "username": "ef867255-921e-43ad-aa39-cf5def58a21e",
//   "password": "NWT4zDKV1T3Z"
// };
// var bluemix = {
//     "url": "https://gateway.watsonplatform.net/natural-language-understanding/api",
//     "username": "4d79f25d-d96b-491b-9731-3b5057567494",
//     "password": "BfWJHGKW2SB0"
// };
// var bluemix={
//     "url": "https://gateway.watsonplatform.net/natural-language-understanding/api",
//     "username": "83ddf1e4-dad6-402d-8c5c-253e3334fb14",
//     "password": "6zk2KRikou1u"
// };
var bluemix= {
    "url": "https://gateway.watsonplatform.net/natural-language-understanding/api",
    "username": "94aa19db-9f54-4a7d-b1f3-3cbf35505b7d",
    "password": "AwiBQax2Ai0R"
}
// var aylien_key = "bd308ed5f3710b40d6e280fafd4d222e";
// var aylien_app_id = "5ceffad9";
var aylien_key = "c49162c07d76aef113d427c8bf7b5beb";
var aylien_app_id = "f1ebb697";
var bing_key1 = "5c2e5368e1df4929b688a0f229ba6fc0";
var bing_key2 = "cc0c117b81c54269a7c1af16b35d28d7";
var CORE_key = "53Ictd96ZekQql2yfzgCTLE7mUwpnVsb";
var DIFF_key = "e5d2443849dcf55543df0010a2daf5d6";
var ebib_key = "e8d16813ad492175b055390bd9d62c2b";
var scopus_key = "f5d063cf0af897101eb37b9294d9c731";


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
console.log('setup');

var BingWebSearch = Bing({ accKey: bing_key1 });


var natural_language_understanding = new NaturalLanguageUnderstandingV1({
    'username': bluemix.username,
    'password': bluemix.password,
    'version_date': '2017-02-27'
});


var textapi = new AYLIENTextAPI({
    application_id: aylien_app_id,
    application_key: aylien_key
});


/*Examples*/
// nlu.analyze({
//     'html': file_data, // Buffer or String
//     'features': {
//         'concepts': {},
//         'keywords': {},
//         'sentiment':{},
//         'emotion':{},
//         'categories':{}
//     }
// }, function(err, response) {
//     if (err)
//         console.log('error:', err);
//     else
//         console.log(JSON.stringify(response, null, 2));
// });
// //
// textapi.summarize({
//     url: 'http://techcrunch.com/2015/04/06/john-oliver-just-changed-the-surveillance-reform-debate',
//     sentences_number: 1
// }, function(error, response) {
//     if (error === null) {
//         response.sentences.forEach(function(s) {
//             console.log(s);
//         });
//     }
// });

// app.post('/search', function(request, response) {
//     request.on("data",function(chunk){
//         var str = ''+chunk;
//         var question = str.substring(str.indexOf("=")+1,str.length);
//         question = question.replace(/\+/g, " ");
//         console.log(question);
//
//         BingWebSearch.web(question, {
//             top: 10
//         }, function(error, res, body){
//             var webpages = [];
//             var titles = [];
//             for(a = 0; a<10; a++){
//                 webpages.push(body.webPages.value[a].displayUrl);
//                 titles.push(body.webPages.value[a].name);
//             }
//             console.log(webpages);
//             console.log(titles);
//
//             var ajaxCallsRemaining = 10;
//             var sentiment = [];
//             var keywords = [];
//             var summaries = [];
//             var secondary = [];
//
//             webpages.forEach(function(arrayElement) {
//                 var parameters = {
//                     'url': arrayElement,
//                     'features': {
//                         'sentiment': {
//                             'limit': 5
//                         },
//                         'keywords':{
//                             'limit': 5
//                         },
//                         'concepts':{
//                             'limit': 5
//                         }
//                     }
//                 };
//                 natural_language_understanding.analyze(parameters, function(err, res) {
//                     if (err) {
//                         console.log('error', err);
//                         // --ajaxCallsRemaining;
//                         // if (ajaxCallsRemaining <= 0) {
//                         //     response.send([titles, webpages,sentiment,keywords]);
//                         // }
//                         sentiment.push(["None"]);
//                         keywords.push(["None"]);
//                     }
//                     else{
//                         var s = [];
//                         var k = [];
//                         var c = [];
//                         for(a = 0; a<res.keywords.length;a++){
//                             k.push(res.keywords[a].text);
//                         }
//                         for(a = 0; a<res.sentiment.length;a++){
//                             s.push(res.sentiment.document.label);
//                         }
//                         for(a = 0; a<res.concepts.length;a++){
//                             k.push(res.concepts[a].text);
//                         }
//                         console.log(k);
//                         console.log(s);
//                         sentiment.push(s);
//                         keywords.push(k);
//                         secondary.push(c);
//                         // --ajaxCallsRemaining;
//                         // if (ajaxCallsRemaining <= 0) {
//                         //     response.send([titles, webpages,sentiment,keywords]);
//                         // }
//
//                         textapi.summarize({
//                             url: arrayElement,
//                             sentences_number: 1
//                         }, function(error, res) {
//                             if (error === null) {
//                                 summaries.push(res.sentences[0]);
//                                 --ajaxCallsRemaining;
//                                 if (ajaxCallsRemaining <= 0) {
//                                     response.send([titles,sentiment,keywords,summaries]);
//                                 }
//                             }
//                             else{
//                                 console.log(error);
//                                 --ajaxCallsRemaining;
//                             }
//                         });
//                     }
//
//                 });
//             });
//
//
//         });
//     });
// });

function xmlToJson(xml) {

    // Create the return object
    var obj = {};

    if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
        for(var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof(obj[nodeName]) == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof(obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
}

app.post('/fetch', function(req, response) {
    req.on("data",function(chunk){
        // console.log("diffbot");
        // var str = ''+chunk;
        // var article = str.substring(str.indexOf("=")+1,str.length);
        //
        // request("https://api.diffbot.com/v3/article?token="+DIFF_key+"&url="+article,function (error, resp, body) {
        //     if (!error && resp.statusCode == 200) {
        //         console.log("diffbot");
        //         var body = JSON.parse(body);
        //         response.send(body);
        //     }
        // });
        var str = ''+chunk;
        var title = str.substring(str.indexOf("=")+1,str.length);
        var article = str.substring(str.lastIndexOf("=")+1,str.length);
        textapi.summarize({
            text: article,
            title: title,
            sentences_number: 4
        }, function(error, res) {
            if (error === null) {
                response.send(res.sentences);
            }
            else{
                response.send(["Error"]);
            }
        });

    });
});

    app.post('/search', function(req, response) {
        req.on("data",function(chunk){
            var str = ''+chunk;
            var question = str.substring(str.indexOf("=")+1,str.length);
            question = question.replace(/\+/g, " ");

            var entityArray = [];

            console.log(question);

            request("http://www.nature.com/opensearch/request?query="+question+"&httpAccept=application/json",function (error, resp, body) {
                if (!error && resp.statusCode == 200) {
                    console.log("Get articles");
                    body = JSON.parse(body);

                    var ajaxCallsRemaining = 10;

                    if(body.feed.entry[0]==null){
                        response.send(entityArray);
                    }
                    for(a = 0; a<10; a++){
                        entityArray.push({ "title":body.feed.entry[a].title,
                        "url":body.feed.entry[a].link,
                        "abstract":body.feed.entry[a]['sru:recordData']['pam:message']['pam:article']['xhtml:head']['dc:description'],
                        "authors":body.feed.entry[a]['sru:recordData']['pam:message']['pam:article']['xhtml:head']['dc:creator'],
                        "publisher":body.feed.entry[a]['sru:recordData']['pam:message']['pam:article']['xhtml:head']['dc:publisher'],
                        "publicationDate":body.feed.entry[a]['sru:recordData']['pam:message']['pam:article']['xhtml:head']['prism:publicationDate'] });
                    }

                    entityArray.forEach(function(entry){
                        console.log("GO GO GO!");

                                var autho = [];
                                if (entry.authors != null && entry.authors != 'null' && entry.authors[0] != 'null') {
                                    for (c = 0; c < entry.authors.length; c++) {
                                        autho.push({
                                            "function": "author",
                                            "first": entry.authors[c].substring(0, entry.authors[c].indexOf(" ")),
                                            "middle": entry.authors[c].substring(entry.authors[c].indexOf(" "), entry.authors[c].lastIndexOf(" ")),
                                            "last": entry.authors[c].substring(entry.authors[c].lastIndexOf(" "))
                                        });
                                    }
                                }
                                else{
                                    autho.push({});
                                }

                                request({
                                    url: "https://api.citation-api.com/2.1/rest/cite",
                                    method:"POST",
                                    json: {
                                            "key": ebib_key,
                                            "source": "journal",
                                            "style": "mla7",
                                            "journal": {
                                                "title": entry.title
                                            },
                                            "pubtype": {
                                                "main": "pubjournal"
                                            },
                                            "pubjournal": {
                                                "title": entry.publisher,
                                                "year": entry.publicationDate.substring(0,4)
                                            },
                                            "contributors":autho
                                    }
                                }, function (error, res, info) {
                                    if (!error && res.statusCode === 200) {
                                        console.log(info);
                                        entry.bibliography=info.data;

                                        var parameters = {
                                            'text': entry.abstract,
                                            'features': {
                                                'sentiment': {
                                                    'limit': 5
                                                },
                                                'keywords':{
                                                    'limit': 5
                                                },
                                                'concepts':{
                                                    'limit': 3
                                                }
                                            }
                                        };
                                        natural_language_understanding.analyze(parameters, function(err, res) {
                                            
                                            if (err) {
                                                console.log('error', err);
                                                --ajaxCallsRemaining;
                                                if (ajaxCallsRemaining <= 0) {
                                                    response.send(entityArray);
                                                }
                                            }
                                            else{
                                                console.log("Actually doing stuff");
                                                var s = [];
                                                var k = [];
                                                var c = [];
                                                for(a = 0; a<res.keywords.length;a++){
                                                    k.push(res.keywords[a].text);
                                                }
                                                s.push(res.sentiment.document.score);
                                                for(a = 0; a<res.concepts.length;a++){
                                                    c.push(res.concepts[a].text);
                                                }
                                                console.log(k);
                                                console.log(s);
                                                entry.sentiment=s;
                                                entry.keywords=k;
                                                entry.concepts=c;

                                                textapi.summarize({
                                                    text: entry.abstract,
                                                    title: entry.title,
                                                    sentences_number: 1
                                                }, function(error, res) {
                                                    console.log("Almost done!");
                                                    if (error === null) {
                                                        entry.summary = res.sentences[0];
                                                        --ajaxCallsRemaining;
                                                        if (ajaxCallsRemaining <= 0) {
                                                            response.send(entityArray);
                                                        }
                                                    }
                                                    else{
                                                        console.log(error);
                                                        --ajaxCallsRemaining;
                                                        if (ajaxCallsRemaining <= 0) {
                                                            response.send(entityArray);
                                                        }
                                                    }
                                                });
                                            }
                                        });
                                    }
                                    else {
                                        --ajaxCallsRemaining;
                                        if (ajaxCallsRemaining <= 0) {
                                            response.send(entityArray);
                                        }
                                    }
                                });
                    });
                }
                else{
                    console.log(error);
                    response.send(entityArray);
                }
            });
        });
    });

// app.post('/search', function(req, response) {
//     req.on("data",function(chunk){
//         var str = ''+chunk;
//         var question = str.substring(str.indexOf("=")+1,str.length);
//         question = question.replace(/\+/g, " ");
//         console.log(question);
//
//         request("https://core.ac.uk:443/api-v2/search/"+question+"?page=1&pageSize=10&apiKey="+CORE_key,function (error, resp, body) {
//             if (!error && resp.statusCode == 200) {
//                 console.log("Get articles");
//                 body = JSON.parse(body);
//                 var articles = [];
//                 for(a = 0; a<10; a++){
//                     articles.push(body.data[a].id);
//                 }
//
//                 var ajaxCallsRemaining = 10;
//                 var titles = [];
//                 var url = [];
//                 var sentiment = [];
//                 var keywords = [];
//                 var summaries = [];
//                 var secondary = [];
//                 var bibliography = [];
//
//                 articles.forEach(function(articleId){
//                     console.log("GO GO GO!");
//                     request("https://core.ac.uk:443/api-v2/articles/get/"+articleId+"?metadata=true&fulltext=true&citations=true&urls=true&apiKey="+CORE_key, function (error, resp, body) {
//                         if(error) {
//                             --ajaxCallsRemaining;
//                             titles.push(["None"]);
//                             url.push(["None"]);
//                             sentiment.push(["None"]);
//                             keywords.push(["None"]);
//                             summaries.push(["None"]);
//                             secondary.push(["None"]);
//                             bibliography.push(["None"]);
//                             if (ajaxCallsRemaining <= 0) {
//                                 response.send([titles,url, keywords, summaries,secondary,sentiment, bibliography]);
//                             }
//                             console.log(error);
//                         }
//                         if (!error && resp.statusCode == 200) {
//                             body = JSON.parse(body);
//                             titles.push(body.data.title);
//                             url.push(body.data.fulltextUrls[0]);
//
//                             request({
//                                 url: "https://api.citation-api.com/2.1/rest/cite",
//                                 json: true, multipart:{
//                                     data: {
//                                         "key": ebib_key,
//                                         "source": "journal",
//                                         "style": "mla7",
//                                         "journal": {
//                                             "title": body.data.title
//                                         },
//                                         "pubtype": {
//                                             "main": "pubjournal"
//                                         },
//                                         "pubjournal": {
//                                             "title": body.data.publisher,
//                                             "year": body.data.year
//                                         },
//                                         "contributors": [{
//                                             "function": "author",
//                                             "first": body.data.authors.substring(0, body.data.authors.firstIndexOf(",")),
//                                             "middle": body.data.authors.sustring(body.data.authors.substring(body.data.authors.firstIndexOf(",")+1).firstIndexOf(" ")),
//                                             "last": body.data.authors.substring(body.data.authors.firstIndexOf(",")+1, body.data.authors.substring(body.data.authors.firstIndexOf(",")+1).firstIndexOf(" "))
//                                         }
//                                         ]
//                                     }
//                                 }
//                             }, function (error, response, info) {
//                                 if (!error && response.statusCode === 200) {
//                                     bibliography.push(JSON.parse(info.data));
//                                     var parameters = {
//                                         'url': body.data.fulltextUrls[0],
//                                         'features': {
//                                             'sentiment': {
//                                                 'limit': 5
//                                             },
//                                             'keywords':{
//                                                 'limit': 5
//                                             },
//                                             'concepts':{
//                                                 'limit': 5
//                                             }
//                                         }
//                                     };
//                                     natural_language_understanding.analyze(parameters, function(err, res) {
//                                         console.log("Actually doing stuff");
//                                         if (err) {
//                                             console.log('error', err);
//                                             sentiment.push(["None"]);
//                                             keywords.push(["None"]);
//                                             summaries.push(["None"]);
//                                             secondary.push(["None"]);
//                                             --ajaxCallsRemaining;
//                                             if (ajaxCallsRemaining <= 0) {
//                                                 response.send([titles,url, keywords, summaries,secondary,sentiment, bibliography]);
//                                             }
//                                         }
//                                         else{
//                                             var s = [];
//                                             var k = [];
//                                             var c = [];
//                                             for(a = 0; a<res.keywords.length;a++){
//                                                 k.push(res.keywords[a].text);
//                                             }
//                                             s.push(res.sentiment.document.label);
//                                             for(a = 0; a<res.concepts.length;a++){
//                                                 c.push(res.concepts[a].text);
//                                             }
//                                             console.log(k);
//                                             console.log(s);
//                                             sentiment.push(s);
//                                             keywords.push(k);
//                                             secondary.push(c);
//
//                                             textapi.summarize({
//                                                 url: body.data.fulltextUrls[0],
//                                                 sentences_number: 1
//                                             }, function(error, res) {
//                                                 console.log("Almost done!");
//                                                 if (error === null) {
//                                                     summaries.push(res.sentences[0]);
//                                                     --ajaxCallsRemaining;
//                                                     if (ajaxCallsRemaining <= 0) {
//                                                         response.send([titles,url, keywords, summaries,secondary,sentiment, bibliography]);
//                                                     }
//                                                 }
//                                                 else{
//                                                     console.log(error);
//                                                     summaries.push(["None"]);
//                                                     --ajaxCallsRemaining;
//                                                     if (ajaxCallsRemaining <= 0) {
//                                                         response.send([titles,url, keywords, summaries,secondary,sentiment, bibliography]);
//                                                     }
//                                                 }
//                                             });
//                                         }
//                                     });
//                                 }
//                                 else {
//                                     sentiment.push(["None"]);
//                                     keywords.push(["None"]);
//                                     summaries.push(["None"]);
//                                     secondary.push(["None"]);
//                                     bibliography.push(["None"]);
//                                     if (ajaxCallsRemaining <= 0) {
//                                         response.send([titles,url, keywords, summaries,secondary,sentiment, bibliography]);
//                                     }
//                                 }
//                             });
//                         }
//                     });
//                 });
//             }
//             else{
//                 console.log(error);
//             }
//         });
//     });
// });



//Runs app
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});