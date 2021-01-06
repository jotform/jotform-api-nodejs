const defaults = {
  url: 'https://api.jotform.com',
  apiKey: undefined,
  version: 'latest',
  debug: false,
  timeout: 10000 // 10 seconds
}

const _url = defaults.url
  , _apiKey = defaults.apiKey
  , _version = defaults.version
  , _debug = defaults.debug
  , request = require('request')
  , Q = require('q')

function sendRequest(deferred, url, verb, postData) {
  if(_debug) {
    console.log(verb.toUpperCase() + ' to URL:', url)
  }
  
  if(typeof _apiKey === 'undefined') {
    deferred.reject(new Error('API Key is undefined'))
  } else {
    
    const options = {
      url: url,
      method: verb,
      json: true
    }
    if(verb === 'post') {
      options.body = typeof postData !== 'undefined' ? require('querystring').stringify(postData) : ''
    }
    request(options, function (err, response, body) {
      if(!err && response.statusCode == 200 && body.responseCode == 200) {
        deferred.resolve(body.content)
      }
      if(response.statusCode != 200) {
        deferred.reject(new Error(body.message))
      }
      if(err) {
        deferred.reject(new Error('Error while request, reason unknown'))
      }
    })
  }
}

exports.options = function (options) {
  
  if(!options) options = {}
  
  const _url = options.url || defaults.url
    , _apiKey = options.apiKey || defaults.apiKey
    , _version = options.version || defaults.version
    , _debug = options.debug || defaults.debug
  
  if(_debug) {
    console.log('jotform API client options\n', {url: _url, apiKey: _apiKey, version: _version, debug: _debug})
  }
}

exports.getUser = function () {
  const deferred = Q.defer()
    , endPoint = '/user'
    , requestUrl = _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey
    , requestVerb = 'get'
  sendRequest(deferred, requestUrl, requestVerb)
  return deferred.promise
}

exports.getUsage = function () {
  const deferred = Q.defer()
    , endPoint = '/user/usage'
    , requestUrl = _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey
    , requestVerb = 'get'
  sendRequest(deferred, requestUrl, requestVerb)
  return deferred.promise
}

exports.getForms = function () {
  const deferred = Q.defer()
    , endPoint = '/user/forms'
    , requestUrl = _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey
    , requestVerb = 'get'
  sendRequest(deferred, requestUrl, requestVerb)
  return deferred.promise
}

exports.getSubmissions = function () {
  const deferred = Q.defer()
    , endPoint = 'user/submissions'
    , requestUrl = _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey
    , requestVerb = 'get'
  sendRequest(deferred, requestUrl, requestVerb)
  return deferred.promise
}

exports.getSubusers = function () {
  const deferred = Q.defer()
    , endPoint = 'user/subusers'
    , requestUrl = _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey
    , requestVerb = 'get'
  sendRequest(deferred, requestUrl, requestVerb)
  return deferred.promise
}

exports.getFolders = function () {
  const deferred = Q.defer()
    , endPoint = '/user/folders'
    , requestUrl = _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey
    , requestVerb = 'get'
  sendRequest(deferred, requestUrl, requestVerb)
  return deferred.promise
}

exports.getReports = function () {
  const deferred = Q.defer()
    , endPoint = '/user/reports'
    , requestUrl = _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey
    , requestVerb = 'get'
  sendRequest(deferred, requestUrl, requestVerb)
  return deferred.promise
}

exports.getSettings = function () {
  const deferred = Q.defer()
    , endPoint = '/user/settings'
    , requestUrl = _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey
    , requestVerb = 'get'
  sendRequest(deferred, requestUrl, requestVerb)
  return deferred.promise
}

exports.getHistory = function () {
  const deferred = Q.defer()
    , endPoint = '/user/history'
    , requestUrl = _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey
    , requestVerb = 'get'
  sendRequest(deferred, requestUrl, requestVerb)
  return deferred.promise
}

exports.getForm = function (formID) {
  let deferred = Q.defer()
  if(formID === undefined) {
    deferred.reject(new Error('Form ID is undefined'))
  }
  const endPoint = '/form'
    ,
    requestUrl = _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '/' + formID + '?apiKey=' + _apiKey
    , requestVerb = 'get'
  sendRequest(deferred, requestUrl, requestVerb)
  return deferred.promise
}

exports.getFormQuestions = function (formID) {
  let deferred = Q.defer()
  if(formID === undefined) {
    deferred.reject(new Error('Form ID is undefined'))
  }
  const endPoint = '/form'
    ,
    requestUrl = _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '/' + formID + '/questions' + '?apiKey=' + _apiKey
    , requestVerb = 'get'
  sendRequest(deferred, requestUrl, requestVerb)
  return deferred.promise
}

exports.getFormQuestion = function (formID, qid) {
  let deferred = Q.defer()
  if(formID === undefined) {
    deferred.reject(new Error('Form ID is undefined'))
  }
  if(qid === undefined) {
    deferred.reject(new Error('Question ID is undefined'))
  }
  const endPoint = '/form'
    ,
    requestUrl = _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '/' + formID + '/question/' + qid + '?apiKey=' + _apiKey
    , requestVerb = 'get'
  sendRequest(deferred, requestUrl, requestVerb)
  return deferred.promise
}

exports.getFormSubmissions = function (formID) {
  let deferred = Q.defer()
  if(formID === undefined) {
    deferred.reject(new Error('Form ID is undefined'))
  }
  const endPoint = '/form'
    ,
    requestUrl = _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '/' + formID + '/submissions' + '?apiKey=' + _apiKey
    , requestVerb = 'get'
  sendRequest(deferred, requestUrl, requestVerb)
  return deferred.promise
}

exports.createFormSubmission = function (formID, submissions) {
  let deferred = Q.defer()
  if(formID === undefined) {
    deferred.reject(new Error('Form ID is undefined'))
  }
  
  const endPoint = '/form'
    ,
    requestUrl = _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '/' + formID + '/submissions' + '?apiKey=' + _apiKey
    , requestVerb = 'post'
    , postData = {
      apiKey: _apiKey,
      submissions: submissions
    }
  
  return deferred.promise
  sendRequest(deferred, requestUrl, requestVerb, postData)
}

exports.getFormFiles = function (formID) {
  let deferred = Q.defer()
  if(formID === undefined) {
    deferred.reject(new Error('Form ID is undefined'))
  }
  const endPoint = '/form'
    ,
    requestUrl = _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '/' + formID + '/files' + '?apiKey=' + _apiKey
    , requestVerb = 'get'
  sendRequest(deferred, requestUrl, requestVerb)
  return deferred.promise
}

exports.getFormWebhooks = function (formID) {
  let deferred = Q.defer()
  if(formID === undefined) {
    deferred.reject(new Error('Form ID is undefined'))
  }
  const endPoint = '/form'
    ,
    requestUrl = _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '/' + formID + '/webhooks' + '?apiKey=' + _apiKey
    , requestVerb = 'get'
  sendRequest(deferred, requestUrl, requestVerb)
  return deferred.promise
}

exports.createFormWebhook = function (formID, webhookURL) {
  let deferred = Q.defer()
  if(formID === undefined) {
    deferred.reject(new Error('Form ID is undefined'))
  }
  
  if(webhookURL === undefined) {
    deferred.reject(new Error('webhookURL is undefined'))
  }
  
  const endPoint = '/form'
    ,
    requestUrl = _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '/' + formID + '/webhooks' + '?apiKey=' + _apiKey
    , requestVerb = 'post'
    , postData = {
      webhookURL: webhookURL
    }
  
  return deferred.promise
  sendRequest(deferred, requestUrl, requestVerb, postData)
}

exports.getSubmission = function (sid) {
  let deferred = Q.defer()
  if(sid === undefined) {
    deferred.reject(new Error('Submission ID is undefined'))
  }
  const endPoint = '/submission'
    , requestUrl = _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '/' + sid + '?apiKey=' + _apiKey
    , requestVerb = 'get'
  sendRequest(deferred, requestUrl, requestVerb)
  return deferred.promise
}

exports.updateSubmission = function (sid, submission) {
  let deferred = Q.defer()
  if(sid === undefined) {
    deferred.reject(new Error('Submission ID is undefined'))
  }
  const endPoint = '/submission'
    , requestUrl = _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '/' + sid
    , requestVerb = 'post'
    , postData = {
    apiKey: _apiKey,
    submissions: submission
  }
  sendRequest(deferred, requestUrl, requestVerb, postData)
  return deferred.promise
}

exports.getReport = function (reportID) {
  let deferred = Q.defer()
  if(reportID === undefined) {
    deferred.reject(new Error('Report ID is undefined'))
  }
  const endPoint = '/report'
    ,
    requestUrl = _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '/' + reportID + '?apiKey=' + _apiKey
    , requestVerb = 'get'
  sendRequest(deferred, requestUrl, requestVerb)
  return deferred.promise
}

exports.getFolder = function (folderID) {
  let deferred = Q.defer()
  if(folderID === undefined) {
    deferred.reject(new Error('Folder ID is undefined'))
  }
  const endPoint = '/folder'
    ,
    requestUrl = _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '/' + folderID + '?apiKey=' + _apiKey
    , requestVerb = 'get'
  sendRequest(deferred, requestUrl, requestVerb)
  return deferred.promise
}

exports.registerUser = function (username, password, email) {
  let deferred = Q.defer()
  if(username === undefined) {
    deferred.reject(new Error('username is undefined'))
  }
  if(password === undefined) {
    deferred.reject(new Error('password is undefined'))
  }
  if(email === undefined) {
    deferred.reject(new Error('email is undefined'))
  }
  
  const endPoint = '/user'
    , requestUrl = _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '/' + 'register'
    , requestVerb = 'post'
    , postData = {
    username: username,
    password: password,
    email: email
  }
  
  return deferred.promise
  sendRequest(deferred, requestUrl, requestVerb, postData)
}

// exports.getUserInvoices = function(){
//     const deferred = Q.defer()
//     , endPoint = "/user/invoices"
//     , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"?apiKey="+_apiKey
//     , requestVerb =  "get";
//     sendRequest(deferred, requestUrl, requestVerb);
//     return deferred.promise;
// }

// exports.getUserSettingsBySettingKey = function(settingsKey){
//     let deferred = Q.defer();
//     if(settingsKey===undefined){
//         deferred.reject(new Error("Settings key is undefined"));
//     }
//     const endPoint = "/user/settings"
//     , requestUrl = _url + (_version==="latest" ? "" : "/v"+_version)+endPoint+"/"+settingsKey+"?apiKey="+_apiKey
//     , requestVerb =  "get";
//     sendRequest(deferred, requestUrl, requestVerb);
//     return deferred.promise;
// }








