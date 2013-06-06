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

exports.getUserForms = function(){
    var deferred = Q.defer()
    , endPoint = "/user/forms"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise;
}

exports.getUserFolders = function(){
    var deferred = Q.defer()
    , endPoint = "/user/folders"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise;
}

exports.getUserSettings = function(){
    var deferred = Q.defer()
    , endPoint = "/user/settings"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise;
}

exports.getUserUsage = function(){
    var deferred = Q.defer()
    , endPoint = "/user/usage"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise;
}

exports.getUserHistory = function(){
    var deferred = Q.defer()
    , endPoint = "/user/history"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise;
}

exports.getUserInvoices = function(){
    var deferred = Q.defer()
    , endPoint = "/user/invoices"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise;
}

exports.getUserReports = function(){
    var deferred = Q.defer()
    , endPoint = "/user/reports"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise;
}

exports.getUserSettingsBySettingKey = function(settingsKey){
    var deferred = Q.defer();
    if(settingsKey===undefined){
        deferred.reject(new Error("Settings key is undefined"));
    }
    var endPoint = "/user/settings"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"/"+settingsKey+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise; 
}

exports.getFormById = function(formId){
    var deferred = Q.defer();
    if(formId===undefined){
        deferred.reject(new Error("Form ID is undefined"));
    }
    var endPoint = "/form"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"/"+formId+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise; 
}

exports.getFilesByFormId = function(formId){
    var deferred = Q.defer();
    if(formId===undefined){
        deferred.reject(new Error("Form ID is undefined"));
    }
    var endPoint = "/form"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"/"+formId+"/files"+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise; 
}

exports.getQuestionsByFormId = function(formId){
    var deferred = Q.defer();
    if(formId===undefined){
        deferred.reject(new Error("Form ID is undefined"));
    }
    var endPoint = "/form"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"/"+formId+"/questions"+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise; 
}

exports.getSubmissionsByFormId = function(formId){
    var deferred = Q.defer();
    if(formId===undefined){
        deferred.reject(new Error("Form ID is undefined"));
    }
    var endPoint = "/form"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"/"+formId+"/submissions"+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise; 
}

exports.getQuestionById = function(formId, questionId){
    var deferred = Q.defer();
    if(formId===undefined){
        deferred.reject(new Error("Form ID is undefined"));
    }
    if(questionId===undefined){
        deferred.reject(new Error("Question ID is undefined"));
    }
    var endPoint = "/form"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"/"+formId+"/question/"+questionId+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise; 
}

exports.getUserReportById = function(reportId){
    var deferred = Q.defer();
    if(reportId===undefined){
        deferred.reject(new Error("Report ID is undefined"));
    }
    var endPoint = "/report"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"/"+reportId+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise; 
}

exports.getUserSubmissionById = function(submissionId){
    var deferred = Q.defer();
    if(submissionId===undefined){
        deferred.reject(new Error("Submission ID is undefined"));
    }
    var endPoint = "/submission"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"/"+submissionId+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise; 
}

exports.addSubmissionsByFormId = function(formId, submissions){
    var deferred = Q.defer();
    if(formId===undefined){
        deferred.reject(new Error("Form ID is undefined"));
    }

    var endPoint = "/form"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"/"+formId+"/submissions"+"?apiKey="+_apiKey
    , requestVerb =  "post"
    , postData = {
        apiKey: _apiKey,
        submissions: submissions
    }

    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise; 
}

exports.getWebhooksByFormID = function(formId){
    var deferred = Q.defer();
    if(formId===undefined){
        deferred.reject(new Error("Form ID is undefined"));
    }
    var endPoint = "/form"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"/"+formId+"/webhooks"+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise; 
}

exports.addWebhookToForm = function(formId, webhookURL){
    var deferred = Q.defer();
    if(formId===undefined){
        deferred.reject(new Error("Form ID is undefined"));
    }

    if(webhookURL===undefined){
        deferred.reject(new Error("webhookURL is undefined"));
    }

    var endPoint = "/form"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"/"+formId+"/webhooks"+"?apiKey="+_apiKey
    , requestVerb =  "post"
    , postData = {
        webhookURL: webhookURL
    }

    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise; 
}



