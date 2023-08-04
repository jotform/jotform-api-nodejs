import { serialize } from 'object-to-formdata';

const defaults = {
  url: 'https://api.jotform.com',
  apiKey: undefined,
  version: 'latest',
  debug: false,
  timeout: 10000, // 10 seconds
};

let { url: _url, apiKey: _apiKey, version: _version, debug: _debug, timeout: _timeout } = defaults;

async function sendRequest<T>(
  url: string,
  method: string,
  body?: unknown,
  customHeaders?: HeadersInit,
): Promise<T> {
  if (_debug) {
    console.log(`Jotform: ${method.toUpperCase()} ${url}`);
  }

  const controller = new AbortController();

  const baseHeaders = {
    accept: 'application/json',
  };

  const options: RequestInit = {
    method,
    headers: customHeaders
      ? {
          ...baseHeaders,
          ...customHeaders,
        }
      : baseHeaders,
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

function get<T = unknown>(url: string, customHeaders?: HeadersInit): Promise<T> {
  return sendRequest<T>(url, 'get', undefined, customHeaders);
}

function post<T = unknown>(url: string, body?: unknown, customHeaders?: HeadersInit): Promise<T> {
  return sendRequest<T>(url, 'post', body, customHeaders);
}

function put<T = unknown>(url: string, body?: unknown, customHeaders?: HeadersInit): Promise<T> {
  return sendRequest(url, 'put', body, customHeaders);
}

function del<T = unknown>(url: string, customHeaders?: HeadersInit): Promise<T> {
  return sendRequest(url, 'delete', undefined, customHeaders);
}

function getRequestUrl(
  endPoint: string,
  params: Record<string, string | number | string[] | undefined> = {},
) {
  if (typeof _apiKey === 'undefined') {
    throw new Error('API Key is undefined');
  }

  const { orderby, direction, ...otherParams } = params;

  const baseUrl = _url + (_version === 'latest' ? '' : `/v${_version}`);

  const urlSearchParams = new URLSearchParams();

  for (const key in otherParams) {
    const value = otherParams[key];

    if (value !== undefined) {
      urlSearchParams.append(key, typeof value === 'object' ? JSON.stringify(value) : `${value}`);
    }
  }

  if (orderby) {
    if (typeof orderby !== 'string') {
      throw new Error('Orderby must be a string');
    }

    if (direction && typeof direction !== 'string') {
      throw new Error('Orderby must be a string');
    }

    const orderbyWithDirection = direction ? `${orderby},${direction}` : orderby;

    urlSearchParams.append('orderby', orderbyWithDirection);
  }

  urlSearchParams.append('apiKey', _apiKey);

  return `${baseUrl + endPoint}?${urlSearchParams.toString()}`;
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

/**
 * General
 */

function getHistory(
  query: {
    action?: string;
    date?: string;
    sortBy?: string;
    startDate?: string;
    endDate?: string;
  } = {},
  customHeaders?: HeadersInit,
): Promise<unknown> {
  const { action, date, sortBy, startDate, endDate } = query;

  const endPoint = '/user/history';
  const requestUrl = getRequestUrl(endPoint, {
    action: action !== undefined ? action : 'all',
    date,
    sortBy: sortBy !== undefined ? sortBy : 'ASC',
    startDate,
    endDate,
  });

  const promise = get(requestUrl, customHeaders);
  return promise;
}

function getSettings(customHeaders?: HeadersInit): Promise<unknown> {
  const endPoint = '/user/settings';
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl, customHeaders);
  return promise;
}

function updateSettings(settingsData: unknown, customHeaders?: HeadersInit): Promise<unknown> {
  if (typeof settingsData !== 'object' || settingsData === null) {
    return Promise.resolve();
  }

  const endPoint = '/user/settings';
  const requestUrl = getRequestUrl(endPoint);
  const postData = settingsData;

  const promise = post(requestUrl, postData, customHeaders);
  return promise;
}

function getSubusers(customHeaders?: HeadersInit): Promise<unknown> {
  const endPoint = '/user/subusers';
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl, customHeaders);
  return promise;
}

function getUsage(customHeaders?: HeadersInit): Promise<unknown> {
  const endPoint = '/user/usage';
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl, customHeaders);
  return promise;
}

function getUser(customHeaders?: HeadersInit): Promise<unknown> {
  const endPoint = '/user';
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl, customHeaders);
  return promise;
}

/**
 * Forms
 */

function getForms(
  query: {
    filter?: Record<string, string>;
    offset?: string;
    limit?: string;
    orderby?: string;
    direction?: 'ASC' | 'DESC';
    fullText?: string;
  } = {},
  customHeaders?: HeadersInit,
): Promise<unknown> {
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

  const promise = get(requestUrl, customHeaders);
  return promise;
}

function getForm(formID: string, customHeaders?: HeadersInit): Promise<unknown> {
  if (formID === undefined) {
    throw new Error('Form ID is undefined');
  }

  const endPoint = `/form/${formID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl, customHeaders);
  return promise;
}

function createForm(formData: unknown, customHeaders?: HeadersInit): Promise<unknown> {
  if (typeof formData !== 'object' || formData === null) {
    return Promise.resolve();
  }

  const endPoint = '/user/forms';
  const requestUrl = getRequestUrl(endPoint);
  const postData = formData;

  const promise = post(requestUrl, postData, customHeaders);
  return promise;
}

function createForms(formsData: unknown, customHeaders?: HeadersInit): Promise<unknown> {
  if (typeof formsData !== 'object' || formsData === null) {
    return Promise.resolve();
  }

  const endPoint = '/user/forms';
  const requestUrl = getRequestUrl(endPoint);
  const postData = formsData;

  const promise = put(requestUrl, postData, customHeaders);
  return promise;
}

function deleteForm(formID: string, customHeaders?: HeadersInit): Promise<unknown> {
  const endPoint = `/form/${formID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = del(requestUrl, customHeaders);
  return promise;
}

function cloneForm(formID: string, customHeaders?: HeadersInit): Promise<unknown> {
  const endPoint = `/form/${formID}/clone`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = post(requestUrl, customHeaders);
  return promise;
}

/**
 * Form files
 */

function getFormFiles(formID: string, customHeaders?: HeadersInit): Promise<unknown> {
  if (formID === undefined) {
    throw new Error('Form ID is undefined');
  }

  const endPoint = `/form/${formID}/files`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl, customHeaders);
  return promise;
}

/**
 * Form properties
 */

function getFormProperties(formID: string, customHeaders?: HeadersInit): Promise<unknown> {
  const endPoint = `/form/${formID}/properties`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl, customHeaders);
  return promise;
}

function getFormProperty(
  formID: string,
  key: string,
  customHeaders?: HeadersInit,
): Promise<unknown> {
  const endPoint = `/form/${formID}/properties/${key}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl, customHeaders);
  return promise;
}

function addFormProperty(
  formID: string,
  propertyData: unknown,
  customHeaders?: HeadersInit,
): Promise<unknown> {
  if (typeof propertyData !== 'object' || propertyData === null) {
    return Promise.resolve();
  }

  const endPoint = `/form/${formID}/properties`;
  const requestUrl = getRequestUrl(endPoint);
  const postData = propertyData;

  const promise = post(requestUrl, postData, customHeaders);
  return promise;
}

function addFormProperties(
  formID: string,
  propertyData: unknown,
  customHeaders?: HeadersInit,
): Promise<unknown> {
  if (typeof propertyData !== 'object' || propertyData === null) {
    return Promise.resolve();
  }

  const endPoint = `/form/${formID}/properties`;
  const requestUrl = getRequestUrl(endPoint);
  const postData = propertyData;

  const promise = put(requestUrl, postData, customHeaders);
  return promise;
}

/**
 * Form questions
 */

function getFormQuestions(formID: string, customHeaders?: HeadersInit): Promise<unknown> {
  if (formID === undefined) {
    throw new Error('Form ID is undefined');
  }

  const endPoint = `/form/${formID}/questions`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl, customHeaders);
  return promise;
}

function getFormQuestion(
  formID: string,
  questionID: string,
  customHeaders?: HeadersInit,
): Promise<unknown> {
  if (formID === undefined) {
    throw new Error('Form ID is undefined');
  }

  if (questionID === undefined) {
    throw new Error('Question ID is undefined');
  }

  const endPoint = `/form/${formID}/question/${questionID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl, customHeaders);
  return promise;
}

function addFormQuestion(
  formID: string,
  questionData: unknown,
  customHeaders?: HeadersInit,
): Promise<unknown> {
  if (typeof questionData !== 'object' || questionData === null) {
    return Promise.resolve();
  }

  const endPoint = `/form/${formID}/questions`;
  const requestUrl = getRequestUrl(endPoint);
  const postData = questionData;

  const promise = post(requestUrl, postData, customHeaders);
  return promise;
}

function addFormQuestions(
  formID: string,
  questionData: unknown,
  customHeaders?: HeadersInit,
): Promise<unknown> {
  if (typeof questionData !== 'object' || questionData === null) {
    return Promise.resolve();
  }

  const endPoint = `/form/${formID}/questions`;
  const requestUrl = getRequestUrl(endPoint);
  const postData = questionData;

  const promise = put(requestUrl, postData, customHeaders);
  return promise;
}

function deleteFormQuestion(
  formID: string,
  questionID: string,
  customHeaders?: HeadersInit,
): Promise<unknown> {
  const endPoint = `/form/${formID}/question/${questionID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = del(requestUrl, customHeaders);
  return promise;
}

/**
 * Form reports
 */

function getFormReports(formID: string, customHeaders?: HeadersInit): Promise<unknown> {
  if (formID === undefined) {
    throw new Error('Form ID is undefined');
  }

  const endPoint = `/form/${formID}/reports`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl, customHeaders);
  return promise;
}

function getFormReport(
  formID: string,
  reportID: string,
  customHeaders?: HeadersInit,
): Promise<unknown> {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return getReport(reportID, customHeaders);
}

function createFormReport(
  formID: string,
  reportData: unknown,
  customHeaders?: HeadersInit,
): Promise<unknown> {
  if (formID === undefined) {
    throw new Error('Form ID is undefined');
  }

  const endPoint = `/form/${formID}/reports`;
  const requestUrl = getRequestUrl(endPoint);
  const postData = reportData;

  const promise = post(requestUrl, postData, customHeaders);
  return promise;
}

function deleteFormReport(
  formID: string,
  reportID: string,
  customHeaders?: HeadersInit,
): Promise<unknown> {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return deleteReport(reportID, customHeaders);
}

/**
 * Form submissions
 */

function getFormSubmissions(
  formID: string,
  query: {
    filter?: Record<string, string>;
    offset?: string;
    limit?: string;
    orderby?: string;
    direction?: 'ASC' | 'DESC';
  } = {},
  customHeaders?: HeadersInit,
): Promise<unknown> {
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

  const promise = get(requestUrl, customHeaders);
  return promise;
}

function getFormSubmission(
  formID: string,
  submissionID: string,
  customHeaders?: HeadersInit,
): Promise<unknown> {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return getSubmission(submissionID, customHeaders);
}

function createFormSubmission(
  formID: string,
  submissionData: unknown,
  customHeaders?: HeadersInit,
): Promise<unknown> {
  if (formID === undefined) {
    throw new Error('Form ID is undefined');
  }

  const endPoint = `/form/${formID}/submissions`;
  const requestUrl = getRequestUrl(endPoint);
  const postData = submissionData;

  const promise = post(requestUrl, postData, customHeaders);
  return promise;
}

function createFormSubmissions(
  formID: string,
  submissionsData: unknown,
  customHeaders?: HeadersInit,
): Promise<unknown> {
  if (typeof submissionsData !== 'object' || submissionsData === null) {
    return Promise.resolve();
  }

  const endPoint = `/form/${formID}/submissions`;
  const requestUrl = getRequestUrl(endPoint);
  const postData = submissionsData;

  const promise = put(requestUrl, postData, customHeaders);
  return promise;
}

function deleteFormSubmission(
  formID: string,
  submissionID: string,
  customHeaders?: HeadersInit,
): Promise<unknown> {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return deleteSubmission(submissionID, customHeaders);
}

/**
 * Form webhooks
 */

function getFormWebhooks(formID: string, customHeaders?: HeadersInit): Promise<unknown> {
  if (formID === undefined) {
    throw new Error('Form ID is undefined');
  }

  const endPoint = `/form/${formID}/webhooks`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl, customHeaders);
  return promise;
}

function createFormWebhook(
  formID: string,
  webhookURL: string,
  customHeaders?: HeadersInit,
): Promise<unknown> {
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

  const promise = post(requestUrl, postData, customHeaders);
  return promise;
}

function deleteFormWebhook(
  formID: string,
  webhookID: string,
  customHeaders?: HeadersInit,
): Promise<unknown> {
  const endPoint = `/form/${formID}/webhooks/${webhookID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = del(requestUrl, customHeaders);
  return promise;
}

/**
 * Folders
 */

function getFolders(customHeaders?: HeadersInit): Promise<unknown> {
  const endPoint = '/user/folders';
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl, customHeaders);
  return promise;
}

function getFolder(folderID: string, customHeaders?: HeadersInit): Promise<unknown> {
  if (folderID === undefined) {
    throw new Error('Folder ID is undefined');
  }

  const endPoint = `/folder/${folderID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl, customHeaders);
  return promise;
}

function createFolder(folderProperties: unknown, customHeaders?: HeadersInit): Promise<unknown> {
  if (typeof folderProperties !== 'object' || folderProperties === null) {
    return Promise.resolve();
  }

  const endPoint = '/folder';
  const requestUrl = getRequestUrl(endPoint);
  const postData = folderProperties;

  const promise = post(requestUrl, postData, customHeaders);
  return promise;
}

function updateFolder(
  folderID: string,
  folderProperties: unknown,
  customHeaders?: HeadersInit,
): Promise<unknown> {
  if (folderID === undefined || typeof folderProperties !== 'object' || folderProperties === null) {
    return Promise.resolve();
  }

  const endPoint = `/folder/${folderID}`;
  const requestUrl = getRequestUrl(endPoint);
  const postData = folderProperties;

  const promise = put(requestUrl, postData, customHeaders);
  return promise;
}

function addFormToFolder(
  folderID: string,
  formID: string,
  customHeaders?: HeadersInit,
): Promise<unknown> {
  const addFormProperties = {
    forms: [formID],
  };

  return updateFolder(folderID, addFormProperties, customHeaders);
}

function addFormsToFolder(
  folderID: string,
  formIDs: string[],
  customHeaders?: HeadersInit,
): Promise<unknown> {
  const folderProperties = {
    forms: formIDs,
  };

  return updateFolder(folderID, folderProperties, customHeaders);
}

function deleteFolder(folderID: string, customHeaders?: HeadersInit): Promise<unknown> {
  if (folderID === undefined) {
    return Promise.resolve();
  }

  const endPoint = `/folder/${folderID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = del(requestUrl, customHeaders);
  return promise;
}

/**
 * Reports
 */

function getReports(customHeaders?: HeadersInit): Promise<unknown> {
  const endPoint = '/user/reports';
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl, customHeaders);
  return promise;
}

function getReport(reportID: string, customHeaders?: HeadersInit): Promise<unknown> {
  if (reportID === undefined) {
    throw new Error('Report ID is undefined');
  }

  const endPoint = `/report/${reportID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl, customHeaders);
  return promise;
}

function deleteReport(reportID: string, customHeaders?: HeadersInit): Promise<unknown> {
  if (reportID === undefined) {
    throw new Error('Report ID is undefined');
  }

  const endPoint = `/report/${reportID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = del(requestUrl, customHeaders);
  return promise;
}

/**
 * Submissions
 */

function getSubmissions(
  query: {
    filter?: Record<string, string>;
    offset?: string;
    limit?: string;
    orderby?: string;
    direction?: 'ASC' | 'DESC';
    fullText?: string;
    nocache?: string;
  } = {},
  customHeaders?: HeadersInit,
): Promise<unknown> {
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

  const promise = get(requestUrl, customHeaders);
  return promise;
}

function getSubmission(submissionID: string, customHeaders?: HeadersInit): Promise<unknown> {
  if (submissionID === undefined) {
    throw new Error('Submission ID is undefined');
  }

  const endPoint = `/submission/${submissionID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl, customHeaders);
  return promise;
}

function updateSubmission(
  submissionID: string,
  submissionData: unknown,
  customHeaders?: HeadersInit,
): Promise<unknown> {
  if (typeof submissionData !== 'object' || submissionData === null) {
    return Promise.resolve();
  }

  const endPoint = `/submission/${submissionID}`;
  const requestUrl = getRequestUrl(endPoint);
  const postData = submissionData;

  const promise = post(requestUrl, postData, customHeaders);
  return promise;
}

function deleteSubmission(submissionID: string, customHeaders?: HeadersInit): Promise<unknown> {
  const endPoint = `/submission/${submissionID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = del(requestUrl, customHeaders);
  return promise;
}

export default {
  options,

  /* General */
  getHistory,
  getSettings,
  updateSettings,
  getSubusers,
  getUsage,
  getUser,

  /* Forms */
  getForms,
  getForm,
  createForm,
  createForms,
  deleteForm,
  cloneForm,

  /* Form files */
  getFormFiles,

  /* Form properties */
  getFormProperties,
  getFormProperty,
  getFormPropertyByKey: getFormProperty, // For backwards compatibility
  addFormProperty,
  addFormProperties,

  /* Form questions */
  getFormQuestions,
  getFormQuestion,
  addFormQuestion,
  addFormQuestions,
  deleteFormQuestion,

  /* Form reports */
  getFormReports,
  getFormReport,
  createFormReport,
  deleteFormReport,

  /* Form submissions */
  getFormSubmissions,
  getFormSubmission,
  createFormSubmission,
  createFormSubmissions,
  deleteFormSubmission,

  /* Form webhooks */
  getFormWebhooks,
  createFormWebhook,
  deleteFormWebhook,

  /* Folders */
  getFolders,
  getFolder,
  createFolder,
  updateFolder,
  addFormToFolder,
  addFormsToFolder,
  deleteFolder,

  /* Reports */
  getReports,
  getReport,
  deleteReport,

  /* Submissions */
  getSubmissions,
  getSubmission,
  updateSubmission,
  editSubmission: updateSubmission, // For backwards compatibility
  deleteSubmission,
};
