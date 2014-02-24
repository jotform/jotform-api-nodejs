var defaults = {
    url: "http://api.jotform.com",
    apiKey: undefined,
    version: "latest",
    debug: false
}

var _url = defaults.url
, _apiKey = defaults.apiKey
, _version = defaults.version
, _debug = defaults.debug
, request = require('request')
, Q = require('q');

function sendRequest(deferred, url, verb, postData){
    if(_debug){
        console.log(verb.toUpperCase() + " to URL:", url);
    }

    if(typeof _apiKey === "undefined"){
        deferred.reject(new Error("API Key is undefined"));
    }

    else {

        var options = {
            url: url, 
            method: verb, 
            json:true
        }
        if(verb==='post'){
            options.body = typeof postData!=="undefined" ? require('querystring').stringify(postData) : ""
        }
        request(options, function(err, response, body){
            if(!err && response.statusCode == 200 && body.responseCode == 200){
                deferred.resolve(body.content);
            }
            if(response.statusCode != 200){
                deferred.reject(new Error(body.message));
            }
            if(err){
                deferred.reject(new Error("Error while request, reason unknown"));
            }
        });
    }
}

exports.options = function(options){

    if(!options) options = {};

    _url = options.url || defaults.url
    , _apiKey = options.apiKey || defaults.apiKey
    , _version = options.version || defaults.version
    , _debug = options.debug || defaults.debug;

    if(_debug){
        console.log("jotform API client options\n", {url: _url, apiKey: _apiKey, version: _version, debug: _debug});
    }
}

exports.getUser = function(){
    var deferred = Q.defer()
    , endPoint = "/user"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise;
}

exports.getUsage = function(){
    var deferred = Q.defer()
    , endPoint = "/user/usage"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise;
}

exports.getForms = function(){
    var deferred = Q.defer()
    , endPoint = "/user/forms"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise;
}

exports.getSubmissions = function(){
    var deferred = Q.defer()
    , endPoint = "user/submissions"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise;
}

exports.getSubusers = function(){
    var deferred = Q.defer()
    , endPoint = "user/subusers"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise;
}

exports.getFolders = function(){
    var deferred = Q.defer()
    , endPoint = "/user/folders"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise;
}

exports.getReports = function(){
    var deferred = Q.defer()
    , endPoint = "/user/reports"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise;
}

exports.getSettings = function(){
    var deferred = Q.defer()
    , endPoint = "/user/settings"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise;
}

exports.getHistory = function(){
    var deferred = Q.defer()
    , endPoint = "/user/history"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise;
}

exports.getForm = function(formID){
    var deferred = Q.defer();
    if(formID===undefined){
        deferred.reject(new Error("Form ID is undefined"));
    }
    var endPoint = "/form"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"/"+formID+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise; 
}

exports.getFormQuestions = function(formID){
    var deferred = Q.defer();
    if(formID===undefined){
        deferred.reject(new Error("Form ID is undefined"));
    }
    var endPoint = "/form"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"/"+formID+"/questions"+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise; 
}

exports.getFormQuestion = function(formID, qid){
    var deferred = Q.defer();
    if(formID===undefined){
        deferred.reject(new Error("Form ID is undefined"));
    }
    if(qid===undefined){
        deferred.reject(new Error("Question ID is undefined"));
    }
    var endPoint = "/form"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"/"+formID+"/question/"+qid+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise; 
}

exports.getFormSubmissions = function(formID){
    var deferred = Q.defer();
    if(formID===undefined){
        deferred.reject(new Error("Form ID is undefined"));
    }
    var endPoint = "/form"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"/"+formID+"/submissions"+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise; 
}

exports.createFormSubmission = function(formID, submissions){
    var deferred = Q.defer();
    if(formID===undefined){
        deferred.reject(new Error("Form ID is undefined"));
    }

    var endPoint = "/form"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"/"+formID+"/submissions"+"?apiKey="+_apiKey
    , requestVerb =  "post"
    , postData = {
        apiKey: _apiKey,
        submissions: submissions
    }

    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise; 
}

exports.getFormFiles = function(formID){
    var deferred = Q.defer();
    if(formID===undefined){
        deferred.reject(new Error("Form ID is undefined"));
    }
    var endPoint = "/form"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"/"+formID+"/files"+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise; 
}

exports.getFormWebhooks = function(formID){
    var deferred = Q.defer();
    if(formID===undefined){
        deferred.reject(new Error("Form ID is undefined"));
    }
    var endPoint = "/form"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"/"+formID+"/webhooks"+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise; 
}

exports.createFormWebhook = function(formID, webhookURL){
    var deferred = Q.defer();
    if(formID===undefined){
        deferred.reject(new Error("Form ID is undefined"));
    }

    if(webhookURL===undefined){
        deferred.reject(new Error("webhookURL is undefined"));
    }

    var endPoint = "/form"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"/"+formID+"/webhooks"+"?apiKey="+_apiKey
    , requestVerb =  "post"
    , postData = {
        webhookURL: webhookURL
    }

    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise; 
}

exports.getSubmission = function(sid){
    var deferred = Q.defer();
    if(sid===undefined){
        deferred.reject(new Error("Submission ID is undefined"));
    }
    var endPoint = "/submission"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"/"+sid+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise; 
}

exports.getReport = function(reportID){
    var deferred = Q.defer();
    if(reportID===undefined){
        deferred.reject(new Error("Report ID is undefined"));
    }
    var endPoint = "/report"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"/"+reportID+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise; 
}

exports.getFolder = function(folderID){
    var deferred = Q.defer();
    if(folderID===undefined){
        deferred.reject(new Error("Folder ID is undefined"));
    }
    var endPoint = "/folder"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"/"+folderID+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise; 
}

exports.registerUser = function(username, password, email){
    var deferred = Q.defer();
    if(username===undefined){
        deferred.reject(new Error("username is undefined"));
    }
    if(password===undefined){
        deferred.reject(new Error("password is undefined"));
    }
    if(email===undefined){
        deferred.reject(new Error("email is undefined"));
    }


    var endPoint = "/user"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"/"+"register"
    , requestVerb =  "post"
    , postData = {
        username: username,
        password: password,
        email: email
    }

    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise; 
}




// exports.getUserInvoices = function(){
//     var deferred = Q.defer()
//     , endPoint = "/user/invoices"
//     , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"?apiKey="+_apiKey
//     , requestVerb =  "get";
//     sendRequest(deferred, requestUrl, requestVerb);
//     return deferred.promise;
// }

// exports.getUserSettingsBySettingKey = function(settingsKey){
//     var deferred = Q.defer();
//     if(settingsKey===undefined){
//         deferred.reject(new Error("Settings key is undefined"));
//     }
//     var endPoint = "/user/settings"
//     , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"/"+settingsKey+"?apiKey="+_apiKey
//     , requestVerb =  "get";
//     sendRequest(deferred, requestUrl, requestVerb);
//     return deferred.promise; 
// }








