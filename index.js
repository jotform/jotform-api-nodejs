var Q = require("q");
var request = require("request");

var defaults = {
    url: "http://api.jotform.com",
    apiKey: undefined,
    debug: false
}

var _url = defaults.url;
var _apiKey = defaults.apiKey;
var _debug = defaults.debug;

/* sends a request, returns a promise 
 * path: gets appended to _url.
 * verb: HTTP verb
 * opts: options object
 *	params: url params, encoded with qs
 *	data: request body
 */
function sendRequest(path, verb, opts){
    if(!_apiKey)
        throw new Error("API Key is undefined");

    opts = opts || {};
    var params = opts.params || {};
    params.apiKey = _apiKey;
    var data = opts.data || {};

    var options = {
        url: _url + path,
        method: verb,
        json: true,
        qs: params
    };
    if(verb == "post")
        options.form = data;
    if(verb == "put")
        options.body = data;

    if(_debug)
        console.log(verb.toUpperCase() + " to URL:", options.url);

    var defer = Q.defer();
    request(options, function(err, response, body){
        if(err){
            defer.reject(err);
        }else if(response.statusCode == 200 && body.responseCode == 200){
            defer.resolve(body.content);
        }else{
            defer.reject(new Error(body.message));
        }
    });
    return defer.promise;
}

exports.options = function(options){
    var options = options || {};

    _url = options.url || defaults.url
    _apiKey = options.apiKey || defaults.apiKey
    _debug = options.debug || defaults.debug;

    if(_debug){
        console.log("jotform API client options\n", {url: _url, apiKey: _apiKey, debug: _debug});
    }
}

exports.getUser = function(){
    return sendRequest("/user", "get");
}

exports.getUsage = function(){
    return sendRequest("/user/usage", "get");
}

exports.getSubmissions = function(query){
    query = query || {};
    if(query.filter)
        query.filter = JSON.stringify(query.filter);
    return sendRequest("/user/submissions", "get", { params: query });
}

exports.getSubusers = function(){
    return sendRequest("/user/subusers", "get");
}

exports.getFolders = function(){
    return sendRequest("/user/folders", "get");
}

exports.getReports = function(){
    return sendRequest("/user/reports", "get");
}

exports.getSettings = function(){
    return sendRequest("/user/settings", "get");
}

exports.getHistory = function(query){
    return sendRequest("/user/history", "get", { params: query });
}

exports.getForm = function(formID){
    return sendRequest("/form/"+formID, "get");
}

exports.getFormQuestions = function(formID){
    return sendRequest("/form/"+formID+"/questions", "get");
}

exports.getFormQuestion = function(formID, qid){
    return sendRequest("/form/"+formID+"/question/"+qid, "get");
}

exports.getFormSubmissions = function(formID, query){
    query = query || {};
    if(query.filter)
        query.filter = JSON.stringify(query.filter);
    return sendRequest("/form/"+formID+"/submissions", "get", { params: query });
}

exports.createFormSubmission = function(formID, submissions){
    return sendRequest("/form/"+formID+"/submissions", "post", { data: submissions });
}

exports.createFormSubmissions = function(formID, submissionData) {
    return sendRequest("/form/"+formID+"/submissions", "put", { data: submissionData });
}

exports.getFormFiles = function(formID){
    return sendRequest("/form/"+formID+"/files", "get");
}

exports.getFormWebhooks = function(formID){
    return sendRequest("/form/"+formID+"/webhooks", "get");
}

exports.createFormWebhook = function(formID, webhookURL){
    var data = { webhookURL: webhookURL };
    return sendRequest("/form/"+formID+"/webhooks", "post", { data: data });
}

exports.deleteFormWebhook = function(formID, webhookID) {
    return sendRequest("/form/"+formID+"/webhooks/"+webhookID, "delete");
}

exports.getSubmission = function(sid){
    return sendRequest("/submission/"+sid, "get");
}

exports.editSubmission = function(sid, submissionData) {
    return sendRequest("/submission/"+sid, "post", { data: submissionData });
}

exports.deleteSubmission = function(sid) {
    return sendRequest("/submission/"+sid, "delete");
}

exports.getReport = function(reportID){
    return sendRequest("/report/"+reportID, "get");
}

exports.getFolder = function(folderID){
    return sendRequest("/folder/"+folderID, "get");
}

exports.getForms = function(query){
    query = query || {};
    if(query.filter)
        query.filter = JSON.stringify(query.filter);
    return sendRequest("/user/forms", "get", { params: query });
}

exports.createForm = function(formData) {
    return sendRequest("/user/forms", "post", { data: formData });
}

exports.createForms = function(formsData) {
    return sendRequest("/user/forms", "put", { data: formsData });
}

exports.deleteForm = function(formID) {
    return sendRequest("/form/"+formID, "delete");
}

exports.cloneForm = function(formID) {
    return sendRequest("/form/"+formID+"/clone", "post");
}

exports.addFormQuestion = function(formID, questionData) {
    return sendRequest("/form/"+formID+"/questions", "post", { data: questionData });
}

exports.addFormQuestions = function(formID, questionData) {
    return sendRequest("/form/"+formID+"/questions", "put", { data: questionData });
}

exports.deleteFormQuestion = function(formID, questionID) {
    return sendRequest("/form/"+formID+"/question/"+questionID, "delete");
}

exports.getFormProperties = function(formID) {
    return sendRequest("/form/"+formID+"/properties", "get");
}

exports.addFormProperty = function(formID, propertyData) {
    return sendRequest("/form/"+formID+"/properties", "post", { data: propertyData });
}

exports.addFormProperties = function(formID, propertyData) {
    return sendRequest("/form/"+formID+"/properties", "put", { data: propertyData });
}

exports.getFormPropertyByKey = function(formID, key) {
    return sendRequest("/form/"+formID+"/properties/"+key, "get");
}
