import { serialize } from 'object-to-formdata';

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
        const formData = serialize(body);
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

  clearTimeout(id);

  const responseBody = await (async () => {
    const contentTypeHeader = response.headers.get('content-type');
    const contentType = contentTypeHeader ? contentTypeHeader.split(';')[0] : null;

    switch (contentType) {
      case 'application/json':
        return response.json();
      default:
        return response.text();
    }
  })();

  if (!response.ok) {
    const errorMessage =
      (typeof responseBody === 'object' ? responseBody.message : responseBody) ||
      response.statusText;

    throw new Error(errorMessage);
  }

  if (responseBody.responseCode !== 200) {
    throw new Error(responseBody.message);
  }

  return responseBody.content;
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

function getRequestUrl(endPoint, params = {}) {
  if (typeof _apiKey === 'undefined') {
    throw new Error('API Key is undefined');
  }

  const { orderby, direction, ...otherParams } = params;

  const baseUrl = _url + (_version === 'latest' ? '' : `/v${_version}`);

  const urlSearchParams = new URLSearchParams();

  for (const key in otherParams) {
    if (otherParams[key] !== undefined) {
      urlSearchParams.append(key, otherParams[key]);
    }
  }

  if (orderby) {
    const orderbyWithDirection = direction ? `${orderby},${direction}` : orderby;
    urlSearchParams.append('orderby', orderbyWithDirection);
  }

  urlSearchParams.append('apiKey', _apiKey);

  return `${baseUrl + endPoint}?${urlSearchParams.toString()}`;
}

function getUser() {
  const endPoint = '/user';
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl);
  return promise;
}

function getUsage() {
  const endPoint = '/user/usage';
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl);
  return promise;
}

function getForms(query = {}) {
  const { filter, offset, limit, orderby, direction, fullText } = query;

  if (filter && typeof filter !== 'object') {
    throw new Error('Filter must be an object');
  }

  if (direction && direction !== 'ASC' && direction !== 'DESC') {
    throw new Error('Direction must be ASC or DESC');
  }

  const endPoint = '/user/forms';
  const requestUrl = getRequestUrl(endPoint, {
    filter: filter !== undefined ? JSON.stringify(filter) : undefined,
    offset,
    limit,
    orderby: orderby !== undefined ? orderby : 'created_at',
    fullText,
    direction,
  });

  const promise = get(requestUrl);
  return promise;
}

function getSubmissions(query = {}) {
  const { filter, offset, limit, orderby, direction, fullText, nocache } = query;

  if (filter && typeof filter !== 'object') {
    throw new Error('Filter must be an object');
  }

  if (direction && direction !== 'ASC' && direction !== 'DESC') {
    throw new Error('Direction must be ASC or DESC');
  }

  const endPoint = '/user/submissions';
  const requestUrl = getRequestUrl(endPoint, {
    filter: filter !== undefined ? JSON.stringify(filter) : undefined,
    offset,
    limit,
    orderby: orderby !== undefined ? orderby : 'created_at',
    fullText,
    direction,
    nocache,
  });

  const promise = get(requestUrl);
  return promise;
}

function getSubusers() {
  const endPoint = '/user/subusers';
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl);
  return promise;
}

function getFolders() {
  const endPoint = '/user/folders';
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl);
  return promise;
}

function getReports() {
  const endPoint = '/user/reports';
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl);
  return promise;
}

function getSettings() {
  const endPoint = '/user/settings';
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl);
  return promise;
}

function getHistory(query = {}) {
  const { action, date, sortBy, startDate, endDate } = query;

  const endPoint = '/user/history';
  const requestUrl = getRequestUrl(endPoint, {
    action: action !== undefined ? action : 'all',
    date,
    sortBy: sortBy !== undefined ? sortBy : 'ASC',
    startDate,
    endDate,
  });

  const promise = get(requestUrl);
  return promise;
}

function getForm(formID) {
  if (formID === undefined) {
    throw new Error('Form ID is undefined');
  }

  const endPoint = `/form/${formID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl);
  return promise;
}

function getFormQuestions(formID) {
  if (formID === undefined) {
    throw new Error('Form ID is undefined');
  }

  const endPoint = `/form/${formID}/questions`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl);
  return promise;
}

function getFormQuestion(formID, questionID) {
  if (formID === undefined) {
    throw new Error('Form ID is undefined');
  }

  if (questionID === undefined) {
    throw new Error('Question ID is undefined');
  }

  const endPoint = `/form/${formID}/question/${questionID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl);
  return promise;
}

function getFormSubmissions(formID, query = {}) {
  if (formID === undefined) {
    throw new Error('Form ID is undefined');
  }

  const { filter, offset, limit, orderby, direction } = query;

  if (filter && typeof filter !== 'object') {
    throw new Error('Filter must be an object');
  }

  if (direction && direction !== 'ASC' && direction !== 'DESC') {
    throw new Error('Direction must be ASC or DESC');
  }

  const endPoint = `/form/${formID}/submissions`;
  const requestUrl = getRequestUrl(endPoint, {
    filter: filter !== undefined ? JSON.stringify(filter) : undefined,
    offset,
    limit,
    orderby: orderby !== undefined ? orderby : 'created_at',
    direction,
  });

  const promise = get(requestUrl);
  return promise;
}

function createFormSubmission(formID, submissions) {
  if (formID === undefined) {
    throw new Error('Form ID is undefined');
  }

  const endPoint = `/form/${formID}/submissions`;
  const requestUrl = getRequestUrl(endPoint);
  const postData = submissions;

  const promise = post(requestUrl, postData);
  return promise;
}

function createFormSubmissions(formID, submissionData) {
  if (typeof submissionData !== 'object' || submissionData === null) {
    return Promise.resolve();
  }

  const endPoint = `/form/${formID}/submissions`;
  const requestUrl = getRequestUrl(endPoint);
  const postData = submissionData;

  const promise = put(requestUrl, postData);
  return promise;
}

function getFormFiles(formID) {
  if (formID === undefined) {
    throw new Error('Form ID is undefined');
  }

  const endPoint = `/form/${formID}/files`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl);
  return promise;
}

function getFormWebhooks(formID) {
  if (formID === undefined) {
    throw new Error('Form ID is undefined');
  }

  const endPoint = `/form/${formID}/webhooks`;
  const requestUrl = getRequestUrl(endPoint);

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

  const endPoint = `/form/${formID}/webhooks`;
  const requestUrl = getRequestUrl(endPoint);
  const postData = {
    webhookURL: webhookURL,
  };

  const promise = post(requestUrl, postData);
  return promise;
}

function deleteFormWebhook(formID, webhookID) {
  const endPoint = `/form/${formID}/webhooks/${webhookID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = del(requestUrl);
  return promise;
}

function getSubmission(submissionID) {
  if (submissionID === undefined) {
    throw new Error('Submission ID is undefined');
  }

  const endPoint = `/submission/${submissionID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl);
  return promise;
}

function editSubmission(submissionID, submissionData) {
  if (typeof submissionData !== 'object' || submissionData === null) {
    return Promise.resolve();
  }

  const endPoint = `/submission/${submissionID}`;
  const requestUrl = getRequestUrl(endPoint);
  const postData = submissionData;

  const promise = post(requestUrl, postData);
  return promise;
}

function deleteSubmission(submissionID) {
  const endPoint = `/submission/${submissionID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = del(requestUrl);
  return promise;
}

function getReport(reportID) {
  if (reportID === undefined) {
    throw new Error('Report ID is undefined');
  }

  const endPoint = `/report/${reportID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl);
  return promise;
}

function getFolder(folderID) {
  if (folderID === undefined) {
    throw new Error('Folder ID is undefined');
  }

  const endPoint = `/folder/${folderID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl);
  return promise;
}

function deleteFolder(folderID) {
  if (folderID === undefined) {
    return Promise.resolve();
  }

  const endPoint = `/folder/${folderID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = del(requestUrl);
  return promise;
}

function updateFolder(folderID, folderProperties) {
  if (folderID === undefined || typeof folderProperties !== 'object' || folderProperties === null) {
    return Promise.resolve();
  }

  const endPoint = `/folder/${folderID}`;
  const requestUrl = getRequestUrl(endPoint);
  const postData = folderProperties;

  const promise = put(requestUrl, postData);
  return promise;
}

function createFolder(folderProperties) {
  if (typeof folderProperties !== 'object' || folderProperties === null) {
    return Promise.resolve();
  }

  const endPoint = '/folder';
  const requestUrl = getRequestUrl(endPoint);
  const postData = folderProperties;

  const promise = post(requestUrl, postData);
  return promise;
}

function addFormsToFolder(folderID, formIDs) {
  const folderProperties = {
    forms: formIDs,
  };
  return updateFolder(folderID, folderProperties);
}

function addFormToFolder(folderID, formID) {
  const addFormProperties = {
    forms: [formID],
  };
  return updateFolder(folderID, addFormProperties);
}

function createForm(formData) {
  if (typeof formData !== 'object' || formData === null) {
    return Promise.resolve();
  }

  const endPoint = '/user/forms';
  const requestUrl = getRequestUrl(endPoint);
  const postData = formData;

  const promise = post(requestUrl, postData);
  return promise;
}

function createForms(formsData) {
  if (typeof formsData !== 'object' || formsData === null) {
    return Promise.resolve();
  }

  const endPoint = '/user/forms';
  const requestUrl = getRequestUrl(endPoint);
  const postData = formsData;

  const promise = put(requestUrl, postData);
  return promise;
}

function deleteForm(formID) {
  const endPoint = `/form/${formID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = del(requestUrl);
  return promise;
}

function cloneForm(formID) {
  const endPoint = `/form/${formID}/clone`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = post(requestUrl);
  return promise;
}

function addFormQuestion(formID, questionData) {
  if (typeof questionData !== 'object' || questionData === null) {
    return Promise.resolve();
  }

  const endPoint = `/form/${formID}/questions`;
  const requestUrl = getRequestUrl(endPoint);
  const postData = questionData;

  const promise = post(requestUrl, postData);
  return promise;
}

function addFormQuestions(formID, questionData) {
  if (typeof questionData !== 'object' || questionData === null) {
    return Promise.resolve();
  }

  const endPoint = `/form/${formID}/questions`;
  const requestUrl = getRequestUrl(endPoint);
  const postData = questionData;

  const promise = put(requestUrl, postData);
  return promise;
}

function deleteFormQuestion(formID, questionID) {
  const endPoint = `/form/${formID}/question/${questionID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = del(requestUrl);
  return promise;
}

function getFormProperties(formID) {
  const endPoint = `/form/${formID}/properties`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl);
  return promise;
}

function addFormProperty(formID, propertyData) {
  if (typeof propertyData !== 'object' || propertyData === null) {
    return Promise.resolve();
  }

  const endPoint = `/form/${formID}/properties`;
  const requestUrl = getRequestUrl(endPoint);
  const postData = propertyData;

  const promise = post(requestUrl, postData);
  return promise;
}

function addFormProperties(formID, propertyData) {
  if (typeof propertyData !== 'object' || propertyData === null) {
    return Promise.resolve();
  }

  const endPoint = `/form/${formID}/properties`;
  const requestUrl = getRequestUrl(endPoint);
  const postData = propertyData;

  const promise = put(requestUrl, postData);
  return promise;
}

function getFormPropertyByKey(formID, key) {
  const endPoint = `/form/${formID}/properties/${key}`;
  const requestUrl = getRequestUrl(endPoint);

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
