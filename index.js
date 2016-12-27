var defaults = {
    url: "http://api.jotform.com",
    apiKey: undefined,
    version: "latest",
    debug: false,
    timeout: null
}

var _url = defaults.url
, _apiKey = defaults.apiKey
, _version = defaults.version
, _debug = defaults.debug
, _timeout = defaults.timeout
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
            json:true,
            timeout: _timeout,
        }
        if(verb==='post'){
            options.form = typeof postData!=="undefined" ? postData : {};
            // console.log(require('querystring').stringify(postData));
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
    , _version = options.version || defaults.version
    , _debug = options.debug || defaults.debug
    , _timeout = options.timeout || defaults.timeout;

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

exports.getForms = function(query){

    var filter, offset, limit, orderby, direction, fullText;
    if (query && typeof query === 'object') {
        if (typeof query.filter === 'object' || query.filter) { filter = query.filter || filter; }
        offset = query.offset || offset;
        limit = query.limit || limit;
        orderby = query.orderby || orderby;
        if (query.direction === 'ASC' || query.direction === 'DESC') { direction =  query.direction || direction; }
    } 

    var deferred = Q.defer()
    , endPoint = "/user/forms"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"?apiKey="+_apiKey+
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

    var filter, offset, limit, orderby, direction, fullText, nocache;
    if (query && typeof query === 'object') {
        if (typeof query.filter === 'object' || query.filter) { filter = query.filter || filter; }
        offset = query.offset || offset;
        limit = query.limit || limit;
        orderby = query.orderby || orderby;
        if (query.direction === 'ASC' || query.direction === 'DESC') { direction =  query.direction || direction; }
        fullText = query.fullText || fullText;
        nocache = query.nocache || nocache;
    } 

    var deferred = Q.defer()
    , endPoint = "/user/submissions"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"?apiKey="
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

exports.getHistory = function(query){
    var action, date, sortBy, startDate, endDate;
    if (query && typeof query === 'object') {
        action = query.action || action;
        date = query.date || date;
        sortBy = query.sortBy || sortBy;
        startDate = query.startDate || startDate;
        endDate = query.endDate || endDate;
    }        

    var deferred = Q.defer()
    , endPoint = "/user/history"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"?apiKey="+_apiKey+
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

exports.getFormSubmissions = function(formID, query){

    var filter, offset, limit, orderby, direction;
    if (query && typeof query === 'object') {
        if (typeof query.filter === 'object' || query.filter) { filter = query.filter || filter; }
        offset = query.offset || offset;
        limit = query.limit || limit;
        orderby = query.orderby || orderby;
        if (query.direction === 'ASC' || query.direction === 'DESC') { direction =  query.direction || direction; }
    }

    var deferred = Q.defer();
    if(formID===undefined){
        deferred.reject(new Error("Form ID is undefined"));
    }
    var endPoint = "/form"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"/"+formID+"/submissions"+"?apiKey="+_apiKey
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
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"/"+formID+"/submissions"+"?apiKey="+_apiKey
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
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version) + endPoint + "?apiKey=" + _apiKey
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

    sendRequest(deferred, requestUrl, requestVerb, postData);
    return deferred.promise; 
}

exports.deleteFormWebhook = function(formID, webhookID) {
    var deferred = Q.defer();

    var endPoint = "/form/" + formID + "/webhooks/" + webhookID
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version) + endPoint + "?apiKey=" + _apiKey
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
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"/"+sid+"?apiKey="+_apiKey
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
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version) + endPoint + "?apiKey=" + _apiKey
    , requestVerb =  "post"
    , postData = submissionData

    sendRequest(deferred, requestUrl, requestVerb, postData);
    return deferred.promise;     
}

exports.deleteSubmission = function(sid) {
    var deferred = Q.defer();

    var endPoint = "/submission/" + sid
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version) + endPoint + "?apiKey=" + _apiKey
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

exports.createForm = function(formData) {
    var deferred = Q.defer();
    if(typeof formData != 'object' || formData == null) {
        return;
    }

    var endPoint = "/user/forms"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version) + endPoint + "?apiKey=" + _apiKey
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
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version) + endPoint + "?apiKey=" + _apiKey
    , requestVerb =  "put"
    , postData = formsData

    sendRequest(deferred, requestUrl, requestVerb, postData);
    return deferred.promise;     
}

exports.deleteForm = function(formID) {
    var deferred = Q.defer();

    var endPoint = "/form/" + formID
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version) + endPoint + "?apiKey=" + _apiKey
    , requestVerb =  "delete";

    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise;    
}

exports.cloneForm = function(formID) {
    var deferred = Q.defer();

    var endPoint = "/form/" + formID + "/clone"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version) + endPoint + "?apiKey=" + _apiKey
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
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version) + endPoint + "?apiKey=" + _apiKey
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
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version) + endPoint + "?apiKey=" + _apiKey
    , requestVerb =  "put"
    , postData = questionData

    sendRequest(deferred, requestUrl, requestVerb, postData);
    return deferred.promise;     
}

exports.deleteFormQuestion = function(formID, questionID) {
    var deferred = Q.defer();

    var endPoint = "/form/" + formID + "/question/" + questionID
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version) + endPoint + "?apiKey=" + _apiKey
    , requestVerb =  "delete";

    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise;    
}

exports.getFormProperties = function(formID) {
    var deferred = Q.defer();

    var endPoint = "/form/" + formID + "/properties"
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version) + endPoint + "?apiKey=" + _apiKey
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
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version) + endPoint + "?apiKey=" + _apiKey
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
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version) + endPoint + "?apiKey=" + _apiKey
    , requestVerb =  "put"
    , postData = propertyData

    sendRequest(deferred, requestUrl, requestVerb, postData);
    return deferred.promise;     
}

exports.getFormPropertyByKey = function(formID, key) {
    var deferred = Q.defer();

    var endPoint = "/form/" + formID + "/properties/" + key
    , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version) + endPoint + "?apiKey=" + _apiKey
    , requestVerb =  "get";

    sendRequest(deferred, requestUrl, requestVerb);
    return deferred.promise;     
}








