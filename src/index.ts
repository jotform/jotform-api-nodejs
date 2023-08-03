import { serialize } from 'object-to-formdata';

const defaults = {
  url: 'https://api.jotform.com',
  apiKey: undefined,
  version: 'latest',
  debug: false,
  timeout: 10000, // 10 seconds
};

let { url: _url, apiKey: _apiKey, version: _version, debug: _debug, timeout: _timeout } = defaults;

async function sendRequest<T>(url: string, method: string, body: unknown): Promise<T> {
  if (_debug) {
    console.log(`Jotform: ${method.toUpperCase()} ${url}`);
  }

  const controller = new AbortController();

  const options: RequestInit = {
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
        (options.headers as Record<string, string>)['content-type'] = 'application/json';
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

function get<T = unknown>(url: string): Promise<T> {
  return sendRequest<T>(url, 'get', undefined);
}

function post<T = unknown>(url: string, body?: unknown): Promise<T> {
  return sendRequest<T>(url, 'post', body);
}

function put<T = unknown>(url: string, body?: unknown): Promise<T> {
  return sendRequest(url, 'put', body);
}

function del<T = unknown>(url: string): Promise<T> {
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

function getRequestUrl(endPoint: string, params: Record<string, string | undefined> = {}) {
  if (typeof _apiKey === 'undefined') {
    throw new Error('API Key is undefined');
  }

  const { orderby, direction, ...otherParams } = params;

  const baseUrl = _url + (_version === 'latest' ? '' : `/v${_version}`);

  const urlSearchParams = new URLSearchParams();

  for (const key in otherParams) {
    const value = otherParams[key];

    if (value !== undefined) {
      urlSearchParams.append(key, value);
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

function getForms(
  query: {
    filter?: Record<string, string>;
    offset?: string;
    limit?: string;
    orderby?: string;
    direction?: string;
    fullText?: string;
  } = {},
) {
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

function getSubmissions(
  query: {
    filter?: Record<string, string>;
    offset?: string;
    limit?: string;
    orderby?: string;
    direction?: string;
    fullText?: string;
    nocache?: string;
  } = {},
) {
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

function getHistory(
  query: {
    action?: string;
    date?: string;
    sortBy?: string;
    startDate?: string;
    endDate?: string;
  } = {},
) {
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

function getForm(formID: string) {
  if (formID === undefined) {
    throw new Error('Form ID is undefined');
  }

  const endPoint = `/form/${formID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl);
  return promise;
}

function getFormQuestions(formID: string) {
  if (formID === undefined) {
    throw new Error('Form ID is undefined');
  }

  const endPoint = `/form/${formID}/questions`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl);
  return promise;
}

function getFormQuestion(formID: string, questionID: string) {
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

function getFormSubmissions(
  formID: string,
  query: {
    filter?: Record<string, string>;
    offset?: string;
    limit?: string;
    orderby?: string;
    direction?: string;
  } = {},
) {
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

function createFormSubmission(formID: string, submissionData: unknown) {
  if (formID === undefined) {
    throw new Error('Form ID is undefined');
  }

  const endPoint = `/form/${formID}/submissions`;
  const requestUrl = getRequestUrl(endPoint);
  const postData = submissionData;

  const promise = post(requestUrl, postData);
  return promise;
}

function createFormSubmissions(formID: string, submissionsData: unknown) {
  if (typeof submissionsData !== 'object' || submissionsData === null) {
    return Promise.resolve();
  }

  const endPoint = `/form/${formID}/submissions`;
  const requestUrl = getRequestUrl(endPoint);
  const postData = submissionsData;

  const promise = put(requestUrl, postData);
  return promise;
}

function getFormFiles(formID: string) {
  if (formID === undefined) {
    throw new Error('Form ID is undefined');
  }

  const endPoint = `/form/${formID}/files`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl);
  return promise;
}

function getFormWebhooks(formID: string) {
  if (formID === undefined) {
    throw new Error('Form ID is undefined');
  }

  const endPoint = `/form/${formID}/webhooks`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl);
  return promise;
}

function createFormWebhook(formID: string, webhookURL: string) {
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

function deleteFormWebhook(formID: string, webhookID: string) {
  const endPoint = `/form/${formID}/webhooks/${webhookID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = del(requestUrl);
  return promise;
}

function getSubmission(submissionID: string) {
  if (submissionID === undefined) {
    throw new Error('Submission ID is undefined');
  }

  const endPoint = `/submission/${submissionID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl);
  return promise;
}

function editSubmission(submissionID: string, submissionData: unknown) {
  if (typeof submissionData !== 'object' || submissionData === null) {
    return Promise.resolve();
  }

  const endPoint = `/submission/${submissionID}`;
  const requestUrl = getRequestUrl(endPoint);
  const postData = submissionData;

  const promise = post(requestUrl, postData);
  return promise;
}

function deleteSubmission(submissionID: string) {
  const endPoint = `/submission/${submissionID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = del(requestUrl);
  return promise;
}

function getReport(reportID: string) {
  if (reportID === undefined) {
    throw new Error('Report ID is undefined');
  }

  const endPoint = `/report/${reportID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl);
  return promise;
}

function getFolder(folderID: string) {
  if (folderID === undefined) {
    throw new Error('Folder ID is undefined');
  }

  const endPoint = `/folder/${folderID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl);
  return promise;
}

function deleteFolder(folderID: string) {
  if (folderID === undefined) {
    return Promise.resolve();
  }

  const endPoint = `/folder/${folderID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = del(requestUrl);
  return promise;
}

function updateFolder(folderID: string, folderProperties: unknown) {
  if (folderID === undefined || typeof folderProperties !== 'object' || folderProperties === null) {
    return Promise.resolve();
  }

  const endPoint = `/folder/${folderID}`;
  const requestUrl = getRequestUrl(endPoint);
  const postData = folderProperties;

  const promise = put(requestUrl, postData);
  return promise;
}

function createFolder(folderProperties: unknown) {
  if (typeof folderProperties !== 'object' || folderProperties === null) {
    return Promise.resolve();
  }

  const endPoint = '/folder';
  const requestUrl = getRequestUrl(endPoint);
  const postData = folderProperties;

  const promise = post(requestUrl, postData);
  return promise;
}

function addFormsToFolder(folderID: string, formIDs: string[]) {
  const folderProperties = {
    forms: formIDs,
  };
  return updateFolder(folderID, folderProperties);
}

function addFormToFolder(folderID: string, formID: string) {
  const addFormProperties = {
    forms: [formID],
  };
  return updateFolder(folderID, addFormProperties);
}

function createForm(formData: unknown) {
  if (typeof formData !== 'object' || formData === null) {
    return Promise.resolve();
  }

  const endPoint = '/user/forms';
  const requestUrl = getRequestUrl(endPoint);
  const postData = formData;

  const promise = post(requestUrl, postData);
  return promise;
}

function createForms(formsData: unknown) {
  if (typeof formsData !== 'object' || formsData === null) {
    return Promise.resolve();
  }

  const endPoint = '/user/forms';
  const requestUrl = getRequestUrl(endPoint);
  const postData = formsData;

  const promise = put(requestUrl, postData);
  return promise;
}

function deleteForm(formID: string) {
  const endPoint = `/form/${formID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = del(requestUrl);
  return promise;
}

function cloneForm(formID: string) {
  const endPoint = `/form/${formID}/clone`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = post(requestUrl);
  return promise;
}

function addFormQuestion(formID: string, questionData: unknown) {
  if (typeof questionData !== 'object' || questionData === null) {
    return Promise.resolve();
  }

  const endPoint = `/form/${formID}/questions`;
  const requestUrl = getRequestUrl(endPoint);
  const postData = questionData;

  const promise = post(requestUrl, postData);
  return promise;
}

function addFormQuestions(formID: string, questionData: unknown) {
  if (typeof questionData !== 'object' || questionData === null) {
    return Promise.resolve();
  }

  const endPoint = `/form/${formID}/questions`;
  const requestUrl = getRequestUrl(endPoint);
  const postData = questionData;

  const promise = put(requestUrl, postData);
  return promise;
}

function deleteFormQuestion(formID: string, questionID: string) {
  const endPoint = `/form/${formID}/question/${questionID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = del(requestUrl);
  return promise;
}

function getFormProperties(formID: string) {
  const endPoint = `/form/${formID}/properties`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl);
  return promise;
}

function addFormProperty(formID: string, propertyData: unknown) {
  if (typeof propertyData !== 'object' || propertyData === null) {
    return Promise.resolve();
  }

  const endPoint = `/form/${formID}/properties`;
  const requestUrl = getRequestUrl(endPoint);
  const postData = propertyData;

  const promise = post(requestUrl, postData);
  return promise;
}

function addFormProperties(formID: string, propertyData: unknown) {
  if (typeof propertyData !== 'object' || propertyData === null) {
    return Promise.resolve();
  }

  const endPoint = `/form/${formID}/properties`;
  const requestUrl = getRequestUrl(endPoint);
  const postData = propertyData;

  const promise = put(requestUrl, postData);
  return promise;
}

function getFormPropertyByKey(formID: string, key: string) {
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
