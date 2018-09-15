var Q = require("q");
var qs = require("qs");
var request = require("request");

var defaults = {
    url: "http://api.jotform.com",
    apiKey: undefined,
    debug: false,
}

var _url = defaults.url
, _apiKey = defaults.apiKey
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
            json: true,
        }
        if(verb==='post'){
            options.form = typeof postData!=="undefined" ? postData : {};
        }
        if(verb==='put') {
            options.body = typeof postData!=="undefined" ? JSON.stringify(postData) : "{}";
        }
        request(options, function(err, response, body){
            if(err){
                deferred.reject(err);
                return;
            }
            if(response.statusCode == 200 && body.responseCode == 200){
                deferred.resolve(body.content);
            }
            if(response.statusCode != 200){
                deferred.reject(new Error(body.message));
            }
        });
    }
}

exports.options = function(options){

    if(!options) options = {};

    _url = options.url || defaults.url
    , _apiKey = options.apiKey || defaults.apiKey
    , _debug = options.debug || defaults.debug

    if(_debug){
        console.log("jotform API client options\n", {url: _url, apiKey: _apiKey, debug: _debug});
    }
}

exports.getUser = function(){
    var deferred = Q.defer()
    , endPoint = "/user"
    , requestUrl = _url + endPoint+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise;
}

exports.getUsage = function(){
    var deferred = Q.defer()
    , endPoint = "/user/usage"
    , requestUrl = _url + endPoint+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise;
}

exports.getForms = function(query){

    let query = query || {}
    , filter = query.filter || {}
    , offset = query.offset || ""
    , limit = query.limit || ""
    , orderby = query.orderby || ""
    , direction = query.direction || "";

    var deferred = Q.defer()
    , endPoint = "/user/forms"
    , requestUrl = _url + endPoint+"?apiKey="+_apiKey+
            (filter !== undefined ? "&filter=" + JSON.stringify(filter) : "") +
            (offset !== undefined ? "&offset=" + offset : "") +
            (limit !== undefined ? "&limit=" + limit : "") +
            (orderby !== undefined ? "&orderby=" + orderby : "&orderby=created_at") +
            (fullText !== undefined ? "&fullText=" + fullText : "") +
            (direction !== undefined ? "," + direction : "")
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise;
}

exports.getSubmissions = function(query){

    query = query || {};
    var filter = query.filter || {}
    , offset = query.offset || "";
    , limit = query.limit || "";
    , orderby = query.orderby || "";
    , direction = query.direction || "";
    , fullText = query.fullText || "";
    , nocache = query.nocache || "";

    var deferred = Q.defer()
    , endPoint = "/user/submissions"
    , requestUrl = _url + endPoint+"?apiKey="
            +_apiKey + (filter !== undefined ? "&filter=" + JSON.stringify(filter) : "") +
            (offset !== undefined ? "&offset=" + offset : "") +
            (limit !== undefined ? "&limit=" + limit : "") +
            (orderby !== undefined ? "&orderby=" + orderby : "&orderby=created_at") +
            (nocache !== undefined ? "&nocache=" + nocache : "") +
            (direction !== undefined ? "," + direction : "")
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise;
}

exports.getSubusers = function(){
    var deferred = Q.defer()
    , endPoint = "/user/subusers"
    , requestUrl = _url + endPoint+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise;
}

exports.getFolders = function(){
    var deferred = Q.defer()
    , endPoint = "/user/folders"
    , requestUrl = _url + endPoint+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise;
}

exports.getReports = function(){
    var deferred = Q.defer()
    , endPoint = "/user/reports"
    , requestUrl = _url + endPoint+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise;
}

exports.getSettings = function(){
    var deferred = Q.defer()
    , endPoint = "/user/settings"
    , requestUrl = _url + endPoint+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise;
}

exports.getHistory = function(query){

    query = query || {};
    var action = query.action || ""
    , date = query.date || ""
    , sortBy = query.sortBy || ""
    , startDate = query.startDate || ""
    , endDate = query.endDate || "";


    var deferred = Q.defer()
    , endPoint = "/user/history"
    , requestUrl = _url + endPoint+"?apiKey="+_apiKey+
        (action !== undefined ? "&action=" + action : "&action=all") +
        (date !== undefined ? "&date=" + date : "") +
        (sortBy !== undefined ? "&sortBy=" + sortBy : "&sortBy=ASC") +
        (startDate !== undefined ? "&startDate=" + startDate : "") +
        (endDate !== undefined ? "&endDate=" + endDate : "")
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
    , requestUrl = _url + endPoint+"/"+formID+"?apiKey="+_apiKey
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
    , requestUrl = _url + endPoint+"/"+formID+"/questions"+"?apiKey="+_apiKey
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
    , requestUrl = _url + endPoint+"/"+formID+"/question/"+qid+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise;
}

exports.getFormSubmissions = function(formID, query){

    query = query || {};

    var filter = query.filter || {}
    , offset = query.offset || ""
    , limit = query.limit || ""
    , orderby = query.orderby || ""
    , direction = query.direction || "";

    var deferred = Q.defer();
    if(formID===undefined){
        deferred.reject(new Error("Form ID is undefined"));
    }
    var endPoint = "/form"
    , requestUrl = _url + endPoint+"/"+formID+"/submissions"+"?apiKey="+_apiKey
        + (filter !== undefined ? "&filter=" + JSON.stringify(filter) : "") +
                (offset !== undefined ? "&offset=" + offset : "") +
                (limit !== undefined ? "&limit=" + limit : "") +
                (orderby !== undefined ? "&orderby=" + orderby : "&orderby=created_at") +
                (direction !== undefined ? "," + direction : "")
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
    , requestUrl = _url + endPoint+"/"+formID+"/submissions"+"?apiKey="+_apiKey
    , requestVerb =  "post"
    , postData = submissions

    sendRequest(deferred, requestUrl, requestVerb, postData);
    return deferred.promise;
}

exports.createFormSubmissions = function(formID, submissionData) {
    var deferred = Q.defer();
    if(typeof submissionData != 'object' || submissionData == null) {
        return;
    }

    var endPoint = "/form/" + formID + "/submissions"
    , requestUrl = _url + endPoint + "?apiKey=" + _apiKey
    , requestVerb =  "put"
    , postData = submissionData

    sendRequest(deferred, requestUrl, requestVerb, postData);
    return deferred.promise;
}

exports.getFormFiles = function(formID){
    var deferred = Q.defer();
    if(formID===undefined){
        deferred.reject(new Error("Form ID is undefined"));
    }
    var endPoint = "/form"
    , requestUrl = _url + endPoint+"/"+formID+"/files"+"?apiKey="+_apiKey
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
    , requestUrl = _url + endPoint+"/"+formID+"/webhooks"+"?apiKey="+_apiKey
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
    , requestUrl = _url + endPoint+"/"+formID+"/webhooks"+"?apiKey="+_apiKey
    , requestVerb =  "post"
    , postData = {
        webhookURL: webhookURL
    }

    sendRequest(deferred, requestUrl, requestVerb, postData);
    return deferred.promise;
}

exports.deleteFormWebhook = function(formID, webhookID) {
    var deferred = Q.defer();

    var endPoint = "/form/" + formID + "/webhooks/" + webhookID
    , requestUrl = _url + endPoint + "?apiKey=" + _apiKey
    , requestVerb =  "delete";

    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise;
}

exports.getSubmission = function(sid){
    var deferred = Q.defer();
    if(sid===undefined){
        deferred.reject(new Error("Submission ID is undefined"));
    }
    var endPoint = "/submission"
    , requestUrl = _url + endPoint+"/"+sid+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise;
}

exports.editSubmission = function(sid, submissionData) {
    var deferred = Q.defer();
    if(typeof submissionData != 'object' || submissionData == null) {
        return;
    }
    var endPoint = "/submission/" + sid
    , requestUrl = _url + endPoint + "?apiKey=" + _apiKey
    , requestVerb =  "post"
    , postData = submissionData

    sendRequest(deferred, requestUrl, requestVerb, postData);
    return deferred.promise;
}

exports.deleteSubmission = function(sid) {
    var deferred = Q.defer();

    var endPoint = "/submission/" + sid
    , requestUrl = _url + endPoint + "?apiKey=" + _apiKey
    , requestVerb =  "delete";

    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise;
}

exports.getReport = function(reportID){
    var deferred = Q.defer();
    if(reportID===undefined){
        deferred.reject(new Error("Report ID is undefined"));
    }
    var endPoint = "/report"
    , requestUrl = _url + endPoint+"/"+reportID+"?apiKey="+_apiKey
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
    , requestUrl = _url + endPoint+"/"+folderID+"?apiKey="+_apiKey
    , requestVerb =  "get";
    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise;
}

exports.createForm = function(formData) {
    var deferred = Q.defer();
    if(typeof formData != 'object' || formData == null) {
        return;
    }

    var endPoint = "/user/forms"
    , requestUrl = _url + endPoint + "?apiKey=" + _apiKey
    , requestVerb =  "post"
    , postData = formData

    sendRequest(deferred, requestUrl, requestVerb, postData);
    return deferred.promise;
}

exports.createForms = function(formsData) {
    var deferred = Q.defer();
    if(typeof formsData != 'object' || formsData == null) {
        return;
    }

    var endPoint = "/user/forms"
    , requestUrl = _url + endPoint + "?apiKey=" + _apiKey
    , requestVerb =  "put"
    , postData = formsData

    sendRequest(deferred, requestUrl, requestVerb, postData);
    return deferred.promise;
}

exports.deleteForm = function(formID) {
    var deferred = Q.defer();

    var endPoint = "/form/" + formID
    , requestUrl = _url + endPoint + "?apiKey=" + _apiKey
    , requestVerb =  "delete";

    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise;
}

exports.cloneForm = function(formID) {
    var deferred = Q.defer();

    var endPoint = "/form/" + formID + "/clone"
    , requestUrl = _url + endPoint + "?apiKey=" + _apiKey
    , requestVerb =  "post";

    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise;
}

exports.addFormQuestion = function(formID, questionData) {
    var deferred = Q.defer();
    if(typeof questionData != 'object' || questionData == null) {
        return;
    }
    var endPoint = "/form/" + formID + "/questions"
    , requestUrl = _url + endPoint + "?apiKey=" + _apiKey
    , requestVerb =  "post"
    , postData = questionData

    sendRequest(deferred, requestUrl, requestVerb, postData);
    return deferred.promise;
}

exports.addFormQuestions = function(formID, questionData) {
    var deferred = Q.defer();
    if(typeof questionData != 'object' || questionData == null) {
        return;
    }

    var endPoint = "/form/" + formID + "/questions"
    , requestUrl = _url + endPoint + "?apiKey=" + _apiKey
    , requestVerb =  "put"
    , postData = questionData

    sendRequest(deferred, requestUrl, requestVerb, postData);
    return deferred.promise;
}

exports.deleteFormQuestion = function(formID, questionID) {
    var deferred = Q.defer();

    var endPoint = "/form/" + formID + "/question/" + questionID
    , requestUrl = _url + endPoint + "?apiKey=" + _apiKey
    , requestVerb =  "delete";

    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise;
}

exports.getFormProperties = function(formID) {
    var deferred = Q.defer();

    var endPoint = "/form/" + formID + "/properties"
    , requestUrl = _url + endPoint + "?apiKey=" + _apiKey
    , requestVerb =  "get";

    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise;
}

exports.addFormProperty = function(formID, propertyData) {
    var deferred = Q.defer();
    if(typeof propertyData != 'object' || propertyData == null) {
        return;
    }
    var endPoint = "/form/" + formID + "/properties"
    , requestUrl = _url + endPoint + "?apiKey=" + _apiKey
    , requestVerb =  "post"
    , postData = propertyData

    sendRequest(deferred, requestUrl, requestVerb, postData);
    return deferred.promise;
}

exports.addFormProperties = function(formID, propertyData) {
    var deferred = Q.defer();
    if(typeof propertyData != 'object' || propertyData == null) {
        return;
    }

    var endPoint = "/form/" + formID + "/properties"
    , requestUrl = _url + endPoint + "?apiKey=" + _apiKey
    , requestVerb =  "put"
    , postData = propertyData

    sendRequest(deferred, requestUrl, requestVerb, postData);
    return deferred.promise;
}

exports.getFormPropertyByKey = function(formID, key) {
    var deferred = Q.defer();

    var endPoint = "/form/" + formID + "/properties/" + key
    , requestUrl = _url + endPoint + "?apiKey=" + _apiKey
    , requestVerb =  "get";

    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise;
}
