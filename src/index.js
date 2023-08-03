const defaults = {
  url: 'https://api.jotform.com',
  apiKey: undefined,
  version: 'latest',
  debug: false,
  timeout: 10000, // 10 seconds
};

let { url: _url, apiKey: _apiKey, version: _version, debug: _debug, timeout: _timeout } = defaults;

async function sendRequest(url, method, body) {
  if (_debug) {
    console.log(`Jotform: ${method.toUpperCase()} ${url}`);
  }

  const controller = new AbortController();

  const options = {
    method,
    headers: {
      accept: 'application/json',
    },
    signal: controller.signal,
  };

  if (body) {
    switch (method) {
      case 'post': {
        const formData = new FormData();
        for (const key in body) {
          formData.append(key, body[key]);
        }
        options.body = formData;
        break;
      }
      case 'put': {
        options.body = JSON.stringify(body);
        options.headers['content-type'] = 'application/json';
        break;
      }
    }
  }

  const id = setTimeout(() => controller.abort(), _timeout);

  const response = await fetch(url, options);
  const responseJson = await response.json();

  clearTimeout(id);

  if (response.status !== 200) {
    throw new Error(responseJson.message);
  }

  if (responseJson.responseCode !== 200) {
    throw new Error(responseJson.message);
  }

  return responseJson.content;
}

function get(url) {
  return sendRequest(url, 'get', undefined);
}

function post(url, body) {
  return sendRequest(url, 'post', body);
}

function put(url, body) {
  return sendRequest(url, 'put', body);
}

function del(url) {
  return sendRequest(url, 'delete', undefined);
}

function options(options = {}) {
  const optionsWithDefaults = {
    ...defaults,
    ...options,
  };

  _url = optionsWithDefaults.url;
  _apiKey = optionsWithDefaults.apiKey;
  _version = optionsWithDefaults.version;
  _debug = optionsWithDefaults.debug;
  _timeout = optionsWithDefaults.timeout;

  if (_debug) {
    console.log('Jotform: Updated options', {
      url: _url,
      apiKey: _apiKey,
      version: _version,
      debug: _debug,
    });
  }
}

function getUser() {
  const endPoint = '/user',
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey;

  const promise = get(requestUrl);
  return promise;
}

function getUsage() {
  const endPoint = '/user/usage',
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey;
  const promise = get(requestUrl);
  return promise;
}

function getForms(query) {
  let filter, offset, limit, orderby, direction, fullText;
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

  const endPoint = '/user/forms',
    requestUrl =
      _url +
      (_version === 'latest' ? '' : '/v' + _version) +
      endPoint +
      '?apiKey=' +
      _apiKey +
      (filter !== undefined ? '&filter=' + JSON.stringify(filter) : '') +
      (offset !== undefined ? '&offset=' + offset : '') +
      (limit !== undefined ? '&limit=' + limit : '') +
      (fullText !== undefined ? '&fullText=' + fullText : '') +
      (orderby !== undefined ? '&orderby=' + orderby : '&orderby=created_at') +
      (direction !== undefined ? ',' + direction : '');
  const promise = get(requestUrl);
  return promise;
}

function getSubmissions(query) {
  let filter, offset, limit, orderby, direction, fullText, nocache;
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

  const endPoint = '/user/submissions',
    requestUrl =
      _url +
      (_version === 'latest' ? '' : '/v' + _version) +
      endPoint +
      '?apiKey=' +
      _apiKey +
      (filter !== undefined ? '&filter=' + JSON.stringify(filter) : '') +
      (offset !== undefined ? '&offset=' + offset : '') +
      (limit !== undefined ? '&limit=' + limit : '') +
      (fullText !== undefined ? '&fullText=' + fullText : '') +
      (nocache !== undefined ? '&nocache=' + nocache : '') +
      (orderby !== undefined ? '&orderby=' + orderby : '&orderby=created_at') +
      (direction !== undefined ? ',' + direction : '');
  const promise = get(requestUrl);
  return promise;
}

function getSubusers() {
  const endPoint = '/user/subusers',
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey;
  const promise = get(requestUrl);
  return promise;
}

function getFolders() {
  const endPoint = '/user/folders',
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey;
  const promise = get(requestUrl);
  return promise;
}

function getReports() {
  const endPoint = '/user/reports',
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey;
  const promise = get(requestUrl);
  return promise;
}

function getSettings() {
  const endPoint = '/user/settings',
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey;
  const promise = get(requestUrl);
  return promise;
}

function getHistory(query) {
  let action, date, sortBy, startDate, endDate;
  if (query && typeof query === 'object') {
    action = query.action || action;
    date = query.date || date;
    sortBy = query.sortBy || sortBy;
    startDate = query.startDate || startDate;
    endDate = query.endDate || endDate;
  }

  const endPoint = '/user/history',
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
      (endDate !== undefined ? '&endDate=' + endDate : '');
  const promise = get(requestUrl);
  return promise;
}

function getForm(formID) {
  if (formID === undefined) {
    throw new Error('Form ID is undefined');
  }
  const endPoint = '/form',
    requestUrl =
      _url +
      (_version === 'latest' ? '' : '/v' + _version) +
      endPoint +
      '/' +
      formID +
      '?apiKey=' +
      _apiKey;
  const promise = get(requestUrl);
  return promise;
}

function getFormQuestions(formID) {
  if (formID === undefined) {
    throw new Error('Form ID is undefined');
  }
  const endPoint = '/form',
    requestUrl =
      _url +
      (_version === 'latest' ? '' : '/v' + _version) +
      endPoint +
      '/' +
      formID +
      '/questions' +
      '?apiKey=' +
      _apiKey;
  const promise = get(requestUrl);
  return promise;
}

function getFormQuestion(formID, qid) {
  if (formID === undefined) {
    throw new Error('Form ID is undefined');
  }
  if (qid === undefined) {
    throw new Error('Question ID is undefined');
  }
  const endPoint = '/form',
    requestUrl =
      _url +
      (_version === 'latest' ? '' : '/v' + _version) +
      endPoint +
      '/' +
      formID +
      '/question/' +
      qid +
      '?apiKey=' +
      _apiKey;
  const promise = get(requestUrl);
  return promise;
}

function getFormSubmissions(formID, query) {
  let filter, offset, limit, orderby, direction;
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
  const endPoint = '/form',
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
      (direction !== undefined ? ',' + direction : '');
  const promise = get(requestUrl);
  return promise;
}

function createFormSubmission(formID, submissions) {
  if (formID === undefined) {
    throw new Error('Form ID is undefined');
  }

  const endPoint = '/form',
    requestUrl =
      _url +
      (_version === 'latest' ? '' : '/v' + _version) +
      endPoint +
      '/' +
      formID +
      '/submissions' +
      '?apiKey=' +
      _apiKey,
    postData = submissions;

  const promise = post(requestUrl, postData);
  return promise;
}

function createFormSubmissions(formID, submissionData) {
  if (typeof submissionData !== 'object' || submissionData === null) {
    return;
  }

  const endPoint = '/form/' + formID + '/submissions',
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey,
    postData = submissionData;

  const promise = put(requestUrl, postData);
  return promise;
}

function getFormFiles(formID) {
  if (formID === undefined) {
    throw new Error('Form ID is undefined');
  }
  const endPoint = '/form',
    requestUrl =
      _url +
      (_version === 'latest' ? '' : '/v' + _version) +
      endPoint +
      '/' +
      formID +
      '/files' +
      '?apiKey=' +
      _apiKey;
  const promise = get(requestUrl);
  return promise;
}

function getFormWebhooks(formID) {
  if (formID === undefined) {
    throw new Error('Form ID is undefined');
  }
  const endPoint = '/form',
    requestUrl =
      _url +
      (_version === 'latest' ? '' : '/v' + _version) +
      endPoint +
      '/' +
      formID +
      '/webhooks' +
      '?apiKey=' +
      _apiKey;
  const promise = get(requestUrl);
  return promise;
}

function createFormWebhook(formID, webhookURL) {
  if (formID === undefined) {
    throw new Error('Form ID is undefined');
  }

  if (webhookURL === undefined) {
    throw new Error('webhookURL is undefined');
  }

  const endPoint = '/form',
    requestUrl =
      _url +
      (_version === 'latest' ? '' : '/v' + _version) +
      endPoint +
      '/' +
      formID +
      '/webhooks' +
      '?apiKey=' +
      _apiKey,
    postData = {
      webhookURL: webhookURL,
    };

  const promise = post(requestUrl, postData);
  return promise;
}

function deleteFormWebhook(formID, webhookID) {
  const endPoint = '/form/' + formID + '/webhooks/' + webhookID,
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey;

  const promise = del(requestUrl);
  return promise;
}

function getSubmission(sid) {
  if (sid === undefined) {
    throw new Error('Submission ID is undefined');
  }
  const endPoint = '/submission',
    requestUrl =
      _url +
      (_version === 'latest' ? '' : '/v' + _version) +
      endPoint +
      '/' +
      sid +
      '?apiKey=' +
      _apiKey;
  const promise = get(requestUrl);
  return promise;
}

function editSubmission(sid, submissionData) {
  if (typeof submissionData !== 'object' || submissionData === null) {
    return;
  }
  const endPoint = '/submission/' + sid,
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey,
    postData = submissionData;

  const promise = post(requestUrl, postData);
  return promise;
}

function deleteSubmission(sid) {
  const endPoint = '/submission/' + sid,
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey;

  const promise = del(requestUrl);
  return promise;
}

function getReport(reportID) {
  if (reportID === undefined) {
    throw new Error('Report ID is undefined');
  }
  const endPoint = '/report',
    requestUrl =
      _url +
      (_version === 'latest' ? '' : '/v' + _version) +
      endPoint +
      '/' +
      reportID +
      '?apiKey=' +
      _apiKey;
  const promise = get(requestUrl);
  return promise;
}

function getFolder(folderID) {
  if (folderID === undefined) {
    throw new Error('Folder ID is undefined');
  }
  const endPoint = '/folder',
    requestUrl =
      _url +
      (_version === 'latest' ? '' : '/v' + _version) +
      endPoint +
      '/' +
      folderID +
      '?apiKey=' +
      _apiKey;
  const promise = get(requestUrl);
  return promise;
}

function deleteFolder(folderID) {
  if (folderID === undefined) {
    return;
  }

  const endPoint = '/folder/' + folderID,
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey;

  const promise = del(requestUrl);
  return promise;
}

function updateFolder(folderID, folderProperties) {
  if (folderID === undefined || typeof folderProperties !== 'object' || folderProperties === null) {
    return;
  }

  const endPoint = '/folder/' + folderID,
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey,
    postData = folderProperties;

  const promise = put(requestUrl, postData);
  return promise;
}

function createFolder(folderProperties) {
  if (typeof folderProperties !== 'object' || folderProperties === null) {
    return;
  }

  const endPoint = '/folder',
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey,
    postData = folderProperties;

  const promise = post(requestUrl, postData);
  return promise;
}

function addFormsToFolder(folderID, formIDs) {
  const folderProperties = {
    forms: formIDs,
  };

  return this.updateFolder(folderID, folderProperties);
}

function addFormToFolder(folderID, formID) {
  const addFormProperties = {
    forms: [formID],
  };

  return this.updateFolder(folderID, addFormProperties);
}

function createForm(formData) {
  if (typeof formData !== 'object' || formData === null) {
    return;
  }

  const endPoint = '/user/forms',
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey,
    postData = formData;

  const promise = post(requestUrl, postData);
  return promise;
}

function createForms(formsData) {
  if (typeof formsData !== 'object' || formsData === null) {
    return;
  }

  const endPoint = '/user/forms',
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey,
    postData = formsData;

  const promise = put(requestUrl, postData);
  return promise;
}

function deleteForm(formID) {
  const endPoint = '/form/' + formID,
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey;

  const promise = del(requestUrl);
  return promise;
}

function cloneForm(formID) {
  const endPoint = '/form/' + formID + '/clone',
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey;

  const promise = post(requestUrl);
  return promise;
}

function addFormQuestion(formID, questionData) {
  if (typeof questionData !== 'object' || questionData === null) {
    return;
  }
  const endPoint = '/form/' + formID + '/questions',
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey,
    postData = questionData;

  const promise = post(requestUrl, postData);
  return promise;
}

function addFormQuestions(formID, questionData) {
  if (typeof questionData !== 'object' || questionData === null) {
    return;
  }

  const endPoint = '/form/' + formID + '/questions',
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey,
    postData = questionData;

  const promise = put(requestUrl, postData);
  return promise;
}

function deleteFormQuestion(formID, questionID) {
  const endPoint = '/form/' + formID + '/question/' + questionID,
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey;

  const promise = del(requestUrl);
  return promise;
}

function getFormProperties(formID) {
  const endPoint = '/form/' + formID + '/properties',
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey;

  const promise = get(requestUrl);
  return promise;
}

function addFormProperty(formID, propertyData) {
  if (typeof propertyData !== 'object' || propertyData === null) {
    return;
  }
  const endPoint = '/form/' + formID + '/properties',
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey,
    postData = propertyData;

  const promise = post(requestUrl, postData);
  return promise;
}

function addFormProperties(formID, propertyData) {
  if (typeof propertyData !== 'object' || propertyData === null) {
    return;
  }

  const endPoint = '/form/' + formID + '/properties',
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey,
    postData = propertyData;

  const promise = put(requestUrl, postData);
  return promise;
}

function getFormPropertyByKey(formID, key) {
  const endPoint = '/form/' + formID + '/properties/' + key,
    requestUrl =
      _url + (_version === 'latest' ? '' : '/v' + _version) + endPoint + '?apiKey=' + _apiKey;

  const promise = get(requestUrl);
  return promise;
}

export default {
  options,
  getForm,
  getFormQuestions,
  getFormProperties,
  getUser,
  getUsage,
  getForms,
  getSubmissions,
  getSubusers,
  getFolders,
  getReports,
  getSettings,
  getHistory,
  getFormQuestion,
  getFormSubmissions,
  createFormSubmission,
  createFormSubmissions,
  getFormFiles,
  getFormWebhooks,
  createFormWebhook,
  deleteFormWebhook,
  getSubmission,
  editSubmission,
  deleteSubmission,
  getReport,
  getFolder,
  deleteFolder,
  updateFolder,
  createFolder,
  addFormsToFolder,
  addFormToFolder,
  createForm,
  createForms,
  deleteForm,
  cloneForm,
  addFormQuestion,
  addFormQuestions,
  deleteFormQuestion,
  addFormProperty,
  addFormProperties,
  getFormPropertyByKey,
};
