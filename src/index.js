var defaults = {
  url: 'https://api.jotform.com',
  apiKey: undefined,
  version: 'latest',
  debug: false,
  timeout: 10000, // 10 seconds
};

var _url = defaults.url,
  _apiKey = defaults.apiKey,
  _version = defaults.version,
  _debug = defaults.debug,
  _timeout = defaults.timeout,
  request = require('request');

function sendRequest(url, verb, postData) {
  return new Promise((resolve, reject) => {
    if (_debug) {
      console.log(verb.toUpperCase() + ' to URL:', url);
    }

    if (typeof _apiKey === 'undefined') {
      reject(new Error('API Key is undefined'));
    } else {
      var options = {
        url: url,
        method: verb,
        json: true,
        timeout: _timeout,
      };
      if (verb === 'post') {
        options.form = typeof postData !== 'undefined' ? postData : {};
      } else if (verb === 'put') {
        options.body = typeof postData !== 'undefined' ? postData : {};
      }
      request(options, function (err, response, body) {
        if (err) {
          reject(err);
          return;
        }
        if (response.statusCode == 200 && body.responseCode == 200) {
          resolve(body.content);
        }
        if (response.statusCode != 200) {
          reject(new Error(body.message));
        }
      });
    }
  });
}

exports.options = function (options) {
  if (!options) options = {};

  (_url = options.url || defaults.url),
    (_apiKey = options.apiKey || defaults.apiKey),
    (_version = options.version || defaults.version),
    (_debug = options.debug || defaults.debug),
    (_timeout = options.timeout || defaults.timeout);

  if (_debug) {
    console.log('jotform API client options\n', {
      url: _url,
      apiKey: _apiKey,
      version: _version,
      debug: _debug,
    });
  }
};

exports.getUser = function () {
  var endPoint = '/user',
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey,
    requestVerb = 'get';
  const promise = sendRequest(requestUrl, requestVerb);
  return promise;
};

exports.getUsage = function () {
  var endPoint = '/user/usage',
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey,
    requestVerb = 'get';
  const promise = sendRequest(requestUrl, requestVerb);
  return promise;
};

exports.getForms = function (query) {
  var filter, offset, limit, orderby, direction, fullText;
  if (query && typeof query === 'object') {
    if (typeof query.filter === 'object' || query.filter) {
      filter = query.filter || filter;
    }
    offset = query.offset || offset;
    limit = query.limit || limit;
    orderby = query.orderby || orderby;
    if (query.direction === 'ASC' || query.direction === 'DESC') {
      direction = query.direction || direction;
    }
  }

  var endPoint = '/user/forms',
    requestUrl =
      _url +
      (_version === 'latest' ? '' : '/v' + _version) +
      endPoint +
      '?apiKey=' +
      _apiKey +
      (filter !== undefined ? '&filter=' + JSON.stringify(filter) : '') +
      (offset !== undefined ? '&offset=' + offset : '') +
      (limit !== undefined ? '&limit=' + limit : '') +
      (orderby !== undefined ? '&orderby=' + orderby : '&orderby=created_at') +
      (fullText !== undefined ? '&fullText=' + fullText : '') +
      (direction !== undefined ? ',' + direction : ''),
    requestVerb = 'get';
  const promise = sendRequest(requestUrl, requestVerb);
  return promise;
};

exports.getSubmissions = function (query) {
  var filter, offset, limit, orderby, direction, fullText, nocache;
  if (query && typeof query === 'object') {
    if (typeof query.filter === 'object' || query.filter) {
      filter = query.filter || filter;
    }
    offset = query.offset || offset;
    limit = query.limit || limit;
    orderby = query.orderby || orderby;
    if (query.direction === 'ASC' || query.direction === 'DESC') {
      direction = query.direction || direction;
    }
    fullText = query.fullText || fullText;
    nocache = query.nocache || nocache;
  }

  var endPoint = '/user/submissions',
    requestUrl =
      _url +
      (_version === 'latest' ? '' : '/v' + _version) +
      endPoint +
      '?apiKey=' +
      _apiKey +
      (filter !== undefined ? '&filter=' + JSON.stringify(filter) : '') +
      (offset !== undefined ? '&offset=' + offset : '') +
      (limit !== undefined ? '&limit=' + limit : '') +
      (orderby !== undefined ? '&orderby=' + orderby : '&orderby=created_at') +
      (fullText !== undefined ? '&fullText=' + fullText : '') +
      (nocache !== undefined ? '&nocache=' + nocache : '') +
      (direction !== undefined ? ',' + direction : ''),
    requestVerb = 'get';
  const promise = sendRequest(requestUrl, requestVerb);
  return promise;
};

exports.getSubusers = function () {
  var endPoint = '/user/subusers',
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey,
    requestVerb = 'get';
  const promise = sendRequest(requestUrl, requestVerb);
  return promise;
};

exports.getFolders = function () {
  var endPoint = '/user/folders',
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey,
    requestVerb = 'get';
  const promise = sendRequest(requestUrl, requestVerb);
  return promise;
};

exports.getReports = function () {
  var endPoint = '/user/reports',
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey,
    requestVerb = 'get';
  const promise = sendRequest(requestUrl, requestVerb);
  return promise;
};

exports.getSettings = function () {
  var endPoint = '/user/settings',
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey,
    requestVerb = 'get';
  const promise = sendRequest(requestUrl, requestVerb);
  return promise;
};

exports.getHistory = function (query) {
  var action, date, sortBy, startDate, endDate;
  if (query && typeof query === 'object') {
    action = query.action || action;
    date = query.date || date;
    sortBy = query.sortBy || sortBy;
    startDate = query.startDate || startDate;
    endDate = query.endDate || endDate;
  }

  var endPoint = '/user/history',
    requestUrl =
      _url +
      (_version === 'latest' ? '' : '/v' + _version) +
      endPoint +
      '?apiKey=' +
      _apiKey +
      (action !== undefined ? '&action=' + action : '&action=all') +
      (date !== undefined ? '&date=' + date : '') +
      (sortBy !== undefined ? '&sortBy=' + sortBy : '&sortBy=ASC') +
      (startDate !== undefined ? '&startDate=' + startDate : '') +
      (endDate !== undefined ? '&endDate=' + endDate : ''),
    requestVerb = 'get';
  const promise = sendRequest(requestUrl, requestVerb);
  return promise;
};

exports.getForm = function (formID) {
  if (formID === undefined) {
    throw new Error('Form ID is undefined');
  }
  var endPoint = '/form',
    requestUrl =
      _url +
      (_version === 'latest' ? '' : '/v' + _version) +
      endPoint +
      '/' +
      formID +
      '?apiKey=' +
      _apiKey,
    requestVerb = 'get';
  const promise = sendRequest(requestUrl, requestVerb);
  return promise;
};

exports.getFormQuestions = function (formID) {
  if (formID === undefined) {
    throw new Error('Form ID is undefined');
  }
  var endPoint = '/form',
    requestUrl =
      _url +
      (_version === 'latest' ? '' : '/v' + _version) +
      endPoint +
      '/' +
      formID +
      '/questions' +
      '?apiKey=' +
      _apiKey,
    requestVerb = 'get';
  const promise = sendRequest(requestUrl, requestVerb);
  return promise;
};

exports.getFormQuestion = function (formID, qid) {
  if (formID === undefined) {
    throw new Error('Form ID is undefined');
  }
  if (qid === undefined) {
    throw new Error('Question ID is undefined');
  }
  var endPoint = '/form',
    requestUrl =
      _url +
      (_version === 'latest' ? '' : '/v' + _version) +
      endPoint +
      '/' +
      formID +
      '/question/' +
      qid +
      '?apiKey=' +
      _apiKey,
    requestVerb = 'get';
  const promise = sendRequest(requestUrl, requestVerb);
  return promise;
};

exports.getFormSubmissions = function (formID, query) {
  var filter, offset, limit, orderby, direction;
  if (query && typeof query === 'object') {
    if (typeof query.filter === 'object' || query.filter) {
      filter = query.filter || filter;
    }
    offset = query.offset || offset;
    limit = query.limit || limit;
    orderby = query.orderby || orderby;
    if (query.direction === 'ASC' || query.direction === 'DESC') {
      direction = query.direction || direction;
    }
  }

  if (formID === undefined) {
    throw new Error('Form ID is undefined');
  }
  var endPoint = '/form',
    requestUrl =
      _url +
      (_version === 'latest' ? '' : '/v' + _version) +
      endPoint +
      '/' +
      formID +
      '/submissions' +
      '?apiKey=' +
      _apiKey +
      (filter !== undefined ? '&filter=' + JSON.stringify(filter) : '') +
      (offset !== undefined ? '&offset=' + offset : '') +
      (limit !== undefined ? '&limit=' + limit : '') +
      (orderby !== undefined ? '&orderby=' + orderby : '&orderby=created_at') +
      (direction !== undefined ? ',' + direction : ''),
    requestVerb = 'get';
  const promise = sendRequest(requestUrl, requestVerb);
  return promise;
};

exports.createFormSubmission = function (formID, submissions) {
  if (formID === undefined) {
    throw new Error('Form ID is undefined');
  }

  var endPoint = '/form',
    requestUrl =
      _url +
      (_version === 'latest' ? '' : '/v' + _version) +
      endPoint +
      '/' +
      formID +
      '/submissions' +
      '?apiKey=' +
      _apiKey,
    requestVerb = 'post',
    postData = submissions;

  const promise = sendRequest(requestUrl, requestVerb, postData);
  return promise;
};

exports.createFormSubmissions = function (formID, submissionData) {
  if (typeof submissionData != 'object' || submissionData == null) {
    return;
  }

  var endPoint = '/form/' + formID + '/submissions',
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey,
    requestVerb = 'put',
    postData = submissionData;

  const promise = sendRequest(requestUrl, requestVerb, postData);
  return promise;
};

exports.getFormFiles = function (formID) {
  if (formID === undefined) {
    throw new Error('Form ID is undefined');
  }
  var endPoint = '/form',
    requestUrl =
      _url +
      (_version === 'latest' ? '' : '/v' + _version) +
      endPoint +
      '/' +
      formID +
      '/files' +
      '?apiKey=' +
      _apiKey,
    requestVerb = 'get';
  const promise = sendRequest(requestUrl, requestVerb);
  return promise;
};

exports.getFormWebhooks = function (formID) {
  if (formID === undefined) {
    throw new Error('Form ID is undefined');
  }
  var endPoint = '/form',
    requestUrl =
      _url +
      (_version === 'latest' ? '' : '/v' + _version) +
      endPoint +
      '/' +
      formID +
      '/webhooks' +
      '?apiKey=' +
      _apiKey,
    requestVerb = 'get';
  const promise = sendRequest(requestUrl, requestVerb);
  return promise;
};

exports.createFormWebhook = function (formID, webhookURL) {
  if (formID === undefined) {
    throw new Error('Form ID is undefined');
  }

  if (webhookURL === undefined) {
    throw new Error('webhookURL is undefined');
  }

  var endPoint = '/form',
    requestUrl =
      _url +
      (_version === 'latest' ? '' : '/v' + _version) +
      endPoint +
      '/' +
      formID +
      '/webhooks' +
      '?apiKey=' +
      _apiKey,
    requestVerb = 'post',
    postData = {
      webhookURL: webhookURL,
    };

  const promise = sendRequest(requestUrl, requestVerb, postData);
  return promise;
};

exports.deleteFormWebhook = function (formID, webhookID) {
  var endPoint = '/form/' + formID + '/webhooks/' + webhookID,
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey,
    requestVerb = 'delete';

  const promise = sendRequest(requestUrl, requestVerb);
  return promise;
};

exports.getSubmission = function (sid) {
  if (sid === undefined) {
    throw new Error('Submission ID is undefined');
  }
  var endPoint = '/submission',
    requestUrl =
      _url +
      (_version === 'latest' ? '' : '/v' + _version) +
      endPoint +
      '/' +
      sid +
      '?apiKey=' +
      _apiKey,
    requestVerb = 'get';
  const promise = sendRequest(requestUrl, requestVerb);
  return promise;
};

exports.editSubmission = function (sid, submissionData) {
  if (typeof submissionData != 'object' || submissionData == null) {
    return;
  }
  var endPoint = '/submission/' + sid,
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey,
    requestVerb = 'post',
    postData = submissionData;

  const promise = sendRequest(requestUrl, requestVerb, postData);
  return promise;
};

exports.deleteSubmission = function (sid) {
  var endPoint = '/submission/' + sid,
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey,
    requestVerb = 'delete';

  const promise = sendRequest(requestUrl, requestVerb);
  return promise;
};

exports.getReport = function (reportID) {
  if (reportID === undefined) {
    throw new Error('Report ID is undefined');
  }
  var endPoint = '/report',
    requestUrl =
      _url +
      (_version === 'latest' ? '' : '/v' + _version) +
      endPoint +
      '/' +
      reportID +
      '?apiKey=' +
      _apiKey,
    requestVerb = 'get';
  const promise = sendRequest(requestUrl, requestVerb);
  return promise;
};

exports.getFolder = function (folderID) {
  if (folderID === undefined) {
    throw new Error('Folder ID is undefined');
  }
  var endPoint = '/folder',
    requestUrl =
      _url +
      (_version === 'latest' ? '' : '/v' + _version) +
      endPoint +
      '/' +
      folderID +
      '?apiKey=' +
      _apiKey,
    requestVerb = 'get';
  const promise = sendRequest(requestUrl, requestVerb);
  return promise;
};

exports.deleteFolder = function (folderID) {
  if (folderID === undefined) {
    return;
  }

  var endPoint = '/folder/' + folderID,
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey,
    requestVerb = 'delete';

  const promise = sendRequest(requestUrl, requestVerb);
  return promise;
};

exports.updateFolder = function (folderID, folderProperties) {
  if (folderID === undefined || typeof folderProperties != 'object' || folderProperties == null) {
    return;
  }

  var endPoint = '/folder/' + folderID,
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey,
    requestVerb = 'put',
    postData = folderProperties;

  const promise = sendRequest(requestUrl, requestVerb, postData);
  return promise;
};

exports.createFolder = function (folderProperties) {
  if (typeof folderProperties != 'object' || folderProperties == null) {
    return;
  }

  var endPoint = '/folder',
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey,
    requestVerb = 'post',
    postData = folderProperties;

  const promise = sendRequest(requestUrl, requestVerb, postData);
  return promise;
};

exports.addFormsToFolder = function (folderID, formIDs) {
  const folderProperties = {
    forms: formIDs,
  };

  return this.updateFolder(folderID, folderProperties);
};

exports.addFormToFolder = function (folderID, formID) {
  const addFormProperties = {
    forms: [formID],
  };

  return this.updateFolder(folderID, addFormProperties);
};

exports.createForm = function (formData) {
  if (typeof formData != 'object' || formData == null) {
    return;
  }

  var endPoint = '/user/forms',
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey,
    requestVerb = 'post',
    postData = formData;

  const promise = sendRequest(requestUrl, requestVerb, postData);
  return promise;
};

exports.createForms = function (formsData) {
  if (typeof formsData != 'object' || formsData == null) {
    return;
  }

  var endPoint = '/user/forms',
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey,
    requestVerb = 'put',
    postData = formsData;

  const promise = sendRequest(requestUrl, requestVerb, postData);
  return promise;
};

exports.deleteForm = function (formID) {
  var endPoint = '/form/' + formID,
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey,
    requestVerb = 'delete';

  const promise = sendRequest(requestUrl, requestVerb);
  return promise;
};

exports.cloneForm = function (formID) {
  var endPoint = '/form/' + formID + '/clone',
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey,
    requestVerb = 'post';

  const promise = sendRequest(requestUrl, requestVerb);
  return promise;
};

exports.addFormQuestion = function (formID, questionData) {
  if (typeof questionData != 'object' || questionData == null) {
    return;
  }
  var endPoint = '/form/' + formID + '/questions',
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey,
    requestVerb = 'post',
    postData = questionData;

  const promise = sendRequest(requestUrl, requestVerb, postData);
  return promise;
};

exports.addFormQuestions = function (formID, questionData) {
  if (typeof questionData != 'object' || questionData == null) {
    return;
  }

  var endPoint = '/form/' + formID + '/questions',
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey,
    requestVerb = 'put',
    postData = questionData;

  const promise = sendRequest(requestUrl, requestVerb, postData);
  return promise;
};

exports.deleteFormQuestion = function (formID, questionID) {
  var endPoint = '/form/' + formID + '/question/' + questionID,
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey,
    requestVerb = 'delete';

  const promise = sendRequest(requestUrl, requestVerb);
  return promise;
};

exports.getFormProperties = function (formID) {
  var endPoint = '/form/' + formID + '/properties',
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey,
    requestVerb = 'get';

  const promise = sendRequest(requestUrl, requestVerb);
  return promise;
};

exports.addFormProperty = function (formID, propertyData) {
  if (typeof propertyData != 'object' || propertyData == null) {
    return;
  }
  var endPoint = '/form/' + formID + '/properties',
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey,
    requestVerb = 'post',
    postData = propertyData;

  const promise = sendRequest(requestUrl, requestVerb, postData);
  return promise;
};

exports.addFormProperties = function (formID, propertyData) {
  if (typeof propertyData != 'object' || propertyData == null) {
    return;
  }

  var endPoint = '/form/' + formID + '/properties',
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey,
    requestVerb = 'put',
    postData = propertyData;

  const promise = sendRequest(requestUrl, requestVerb, postData);
  return promise;
};

exports.getFormPropertyByKey = function (formID, key) {
  var endPoint = '/form/' + formID + '/properties/' + key,
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey,
    requestVerb = 'get';

  const promise = sendRequest(requestUrl, requestVerb);
  return promise;
};
