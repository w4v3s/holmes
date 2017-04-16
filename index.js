/**
 * Created by andre on 4/8/2017.
 */

//Required Packages
var $ = require('jquery');
var request = require('request');
var express = require('express');
var http = require('http');
var fs = require('fs');
var Bing = require('node-bing-api');
var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
var AYLIENTextAPI = require('aylien_textapi');
var havenondemand = require("havenondemand");

//API Keys
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
// var bluemix= {
//     "url": "https://gateway.watsonplatform.net/natural-language-understanding/api",
//     "username": "94aa19db-9f54-4a7d-b1f3-3cbf35505b7d",
//     "password": "AwiBQax2Ai0R"
// }
var bluemix = {
  "url": "https://gateway.watsonplatform.net/natural-language-understanding/api",
  "username": "b9a28510-fe8e-4605-bc1e-ee8434cec916",
  "password": "VknWNQ3dtRnJ"
};

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
var haven_key = "fd599798-df20-48df-95d1-5bdb4a735cb9";

/*Setup*/
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

/*API Setup*/
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
var havenapi = new havenondemand.HODClient(haven_key, 'v1')

/*Retrieving Data*/
function relatedConcepts(text, num)
{
    var data={'text' : text}
    havenapi.post('findrelatedconcepts', data, true, function(err, res){
        if(!err)
        {
            var cb = [];
            console.log(res);
            for(var i=0;i<num;i++)
            {
                cb.push(res.entities[i])
            }
            callback(cb);
        }
        else
        {
            console.log(err);
            callback(null);
        }
    })
}
function getSummary(text, title, length, callback){
    textapi.summarize({
        text: text,
        title: title,
        sentences_number: length
    }, function(error, res) {
        if (error === null) {
            callback(res.sentences);
        }
        else{
            console.log(error);
            callback(null);
        }
    });
}
function languageAnalysis(text, callback){
    natural_language_understanding.analyze({
        'text': text,
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
    }, function(err, res) {
        if (!err) {
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
            callback(s, k, c);
        }
        else{
            console.log(err);
            callback(null, null, null);
        }
    });
}
function createMap(depth, responseArr, responseNum, text)
{
    if(depth==0)
    {

    }
    else
    {
        
    }
}
function getCitation(title, publisher, publicationYear, authors, callback){
    var autho = [];
    if (authors != null && authors != 'null' && authors[0] != 'null') {
        for (c = 0; c < authors.length; c++) {
            autho.push({
                "function": "author",
                "first": authors[c].substring(0, authors[c].indexOf(" ")),
                "middle": authors[c].substring(authors[c].indexOf(" "), authors[c].lastIndexOf(" ")),
                "last": authors[c].substring(authors[c].lastIndexOf(" "))
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
                "title": title
            },
            "pubtype": {
                "main": "pubjournal"
            },
            "pubjournal": {
                "title": publisher,
                "year": publicationYear
            },
            "contributors":autho
        }
    }, function (error, res, info) {
        if (!error && res.statusCode === 200) {
            callback(info.data);
        }
        else {
            console.log(error);
            callback(null);
        }
    });
}
function natureJournal(question, length,  callback){
    request("http://www.nature.com/opensearch/request?query="+question+"&httpAccept=application/json&maximumRecords="+length,function (error, resp, body) {
        if (!error && resp.statusCode == 200) {
            var entityArray = [];
            body = JSON.parse(body);
            for(a = 0; a<body.feed.entry.length; a++){
                entityArray.push({ "title":body.feed.entry[a].title,
                    "url":body.feed.entry[a].link,
                    "abstract":body.feed.entry[a]['sru:recordData']['pam:message']['pam:article']['xhtml:head']['dc:description'],
                    "authors":body.feed.entry[a]['sru:recordData']['pam:message']['pam:article']['xhtml:head']['dc:creator'],
                    "publisher":body.feed.entry[a]['sru:recordData']['pam:message']['pam:article']['xhtml:head']['dc:publisher'],
                    "publicationDate":body.feed.entry[a]['sru:recordData']['pam:message']['pam:article']['xhtml:head']['prism:publicationDate'] });
            }
            callback(entityArray);
        }
        else{
            console.log(error);
            callback(null);
        }
    });
}
function bingResults(){

}
function coreJournalUrls(urlarray, callback){
    request({
        url: "https://api.citation-api.com/2.1/rest/cite",
        method:"POST",
        json: {
            "body":urlarray,
            "apiKey": CORE_key
        }
    }, function (error, res, body) {
        if (!error && res.statusCode === 200) {
            var entityArray = [];
            var length = body.length;

            for(a = 0; a<body.length;a++){
                var auth = [];
                for(b=0;b<body[a].data.authors.length;b++){
                    auth.push( body[a].data.authors[b].substring(body[a].data.authors[b].indexOf(",")+2, body[a].data.authors[b].length) + " " + body[a].data.authors[b].substring(0,body[a].data.authors[b].indexOf(",")) )
                }
                getFullArticle("core.ac.uk/display/"+ body[a].data.id,function(text){
                    entityArray.push({ "title":body[a].data.title,
                        "url": "core.ac.uk/display/"+ body[a].data.id,
                        "authors":auth,
                        "abstract":text,
                        "publisher":body[a].data.publisher,
                        "publicationDate":body[a].data.datePublished });
                    --length;
                    if(length<=0){
                        callback(entityArray);
                    }
                });
            }
        }
        else {
            console.log(error);
            callback(null);
        }
    });
}
function coreJournal(question, length, callback){
    request("https://core.ac.uk:443/api-v2/search/"+question+"?page=1&pageSize="+length+"&apiKey="+CORE_key,function (error, resp, body) {
        if (!error && resp.statusCode == 200) {
            body = JSON.parse(body);
            var articles = [];
            for(a = 0; a<body.data.length; a++){
                articles.push(body.data[a].id);
            }

            coreJournalUrls(articles, function(entityArray){
                callback(entityArray);
            });
        }
        else{
            console.log(error);
            callback(null);
        }
    });
}
function getFullArticle(url, callback){
    request("https://api.diffbot.com/v3/article?token="+DIFF_key+"&url="+article,function (error, resp, body) {
        if (!error && resp.statusCode == 200) {
            console.log("diffbot");
            var body = JSON.parse(body);
            var text = body.text;
            callback(text);
        }
        else{
            console.log(error);
            callback(null);
        }
    });
}


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


/*Helper Functions*/
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


    });
});

app.post('/search', function(req, response) {
    req.on("data",function(chunk){
        var str = ''+chunk;
        var question = str.substring(str.indexOf("=")+1,str.length);
        question = question.replace(/\+/g, " ");

        natureJournal(question, 10, function(entityArray){
            console.log("array made");
            var wait = entityArray.length;
            if(wait==0){
                response.send(entityArray);
            }
            entityArray.forEach(function(entry){
                console.log("entered array");
                getCitation(entry.title,entry.publisher,entry.publicationDate.substring(0,4),entry.authors,function(){
                    console.log("\tgot citation");
                    languageAnalysis(entry.abstract, function(s, k , c){
                        console.log("\t\tlanguage analysis");
                        entry.sentiment=s;
                        entry.keywords=k;
                        entry.concepts=c;

                        getSummary(entry.abstract, entry.title, 1, function(s) {
                            console.log("\t\t\tgot summary");
                            entry.summary = s;
                            --wait;
                            if (wait <= 0) {
                                response.send(entityArray);
                            }
                        });
                    });
                });
            });
        });
    });
});

//Runs app
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});