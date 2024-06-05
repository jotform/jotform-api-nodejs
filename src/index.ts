import { serialize } from 'object-to-formdata';

type Options = {
  /**
   * API Key
   *
   * @description Jotform API Key.
   * @url https://api.jotform.com/docs/#gettingstarted
   */
  apiKey: string;
  /**
   * Debug
   *
   * @description Whether to log debug messages.
   * @default false
   */
  debug: boolean;
  /**
   * Timeout
   *
   * @description Timeout for requests in milliseconds.
   * @default 10000
   */
  timeout: number;
  /**
   * URL
   *
   * @description Jotform API URL. Note that the list is not exhaustive. If you're using Jotform Enterprise, it may be `'https://your-domain.com/API'` or `'https://your-subdomain.jotform.com/API'`.
   * @default 'https://api.jotform.com'
   */
  url:
    | 'https://api.jotform.com'
    | 'https://eu-api.jotform.com'
    | 'https://hipaa-api.jotform.com'
    | (string & {});
  /**
   * Version
   *
   * @description Jotform API version.
   * @default 'latest'
   */
  version: 'latest' | '1' | (string & {});
};

type Filter = Record<string, string | number | string[] | undefined>;

const defaultOptions = {
  url: 'https://api.jotform.com',
  version: 'latest',
  debug: false,
  timeout: 10000, // 10 seconds
} satisfies Partial<Options>;

const currentOptions: Partial<Options> = { ...defaultOptions };

async function sendRequest<T>(
  url: string,
  method: string,
  body?: unknown,
  customHeaders?: HeadersInit,
): Promise<T> {
  if (currentOptions.debug) {
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

  const id = setTimeout(() => controller.abort(), currentOptions.timeout);

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
  if (typeof currentOptions.apiKey === 'undefined') {
    throw new Error('API Key is undefined');
  }

  const { orderby, direction, ...otherParams } = params;

  const baseUrl =
    currentOptions.url + (currentOptions.version === 'latest' ? '' : `/v${currentOptions.version}`);

  const urlSearchParams = new URLSearchParams();

  for (const key in otherParams) {
    const value = otherParams[key];

    if (value !== undefined) {
      urlSearchParams.append(key, typeof value === 'object' ? JSON.stringify(value) : `${value}`);
    }
  }

  if (orderby) {
    if (typeof orderby !== 'string') {
      throw new Error('orderby must be a string');
    }

    if (direction && typeof direction !== 'string') {
      throw new Error('direction must be a string');
    }

    const orderbyWithDirection = direction ? `${orderby},${direction}` : orderby;

    urlSearchParams.append('orderby', orderbyWithDirection);
  }

  urlSearchParams.append('apiKey', currentOptions.apiKey);

  return `${baseUrl + endPoint}?${urlSearchParams.toString()}`;
}

/**
 * Options
 *
 * @description Update client options.
 * @param {Partial<Options>} [newOptions]
 */
function options(newOptions: Partial<Options>) {
  Object.assign(currentOptions, newOptions);

  if (currentOptions.debug) {
    console.log('Jotform: Updated options', currentOptions);
  }
}

/**
 * General
 */

type GetHistoryQuery = {
  /**
   * Filter results by activity performed.
   *
   * @default 'all'
   */
  action?:
    | 'all'
    | 'userCreation'
    | 'userLogin'
    | 'formCreation'
    | 'formUpdate'
    | 'formDelete'
    | 'formPurge';
  /**
   * Limit results by a date range. If you'd like to limit results by specific dates you can use startDate and endDate fields instead.
   */
  date?: 'lastWeek' | 'lastMonth' | 'last3Months' | 'last6Months' | 'lastYear' | 'all';
  /**
   * Lists results by ascending and descending order.
   *
   * @example 'ASC'
   */
  sortBy?: 'ASC' | 'DESC';
  /**
   * Limit results to only after a specific date. Format: MM/DD/YYYY.
   *
   * @example '01/31/2013'
   */
  startDate?: string;
  /**
   * Limit results to only before a specific date. Format: MM/DD/YYYY.
   *
   * @example '12/31/2013'
   */
  endDate?: string;
};

/**
 * Get History
 *
 * @description User activity log about things like forms created/modified/deleted, account logins and other operations.
 * @link https://api.jotform.com/docs/#user-history
 * @param {GetHistoryQuery} [query]
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function getHistory(query: GetHistoryQuery = {}, customHeaders?: HeadersInit): Promise<unknown> {
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

/**
 * Get User Settings
 *
 * @description Get user's time zone and language.
 * @link https://api.jotform.com/docs/#user-settings
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function getSettings(customHeaders?: HeadersInit): Promise<unknown> {
  const endPoint = '/user/settings';
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl, customHeaders);
  return promise;
}

/**
 * Update User Settings
 *
 * @description Update user's settings like time zone and language.
 * @link https://api.jotform.com/docs/#post-user-settings
 * @param {unknown} settingsData
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
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

/**
 * Get Sub-User Account List
 *
 * @description Get a list of sub users for this accounts and list of forms and form folders with access privileges.
 * @link https://api.jotform.com/docs/#user-subusers
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function getSubusers(customHeaders?: HeadersInit): Promise<unknown> {
  const endPoint = '/user/subusers';
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl, customHeaders);
  return promise;
}

/**
 * Get Monthly User Usage
 *
 * @description Get number of form submissions received this month. Also, get number of SSL form submissions, payment form submissions and upload space used by user.
 * @link https://api.jotform.com/docs/#user-usage
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function getUsage(customHeaders?: HeadersInit): Promise<unknown> {
  const endPoint = '/user/usage';
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl, customHeaders);
  return promise;
}

/**
 * Get User Information
 *
 * @description Get user account details for this Jotform user. Including user account type, avatar URL, name, email, website URL.
 * @link https://api.jotform.com/docs/#user
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function getUser(customHeaders?: HeadersInit): Promise<unknown> {
  const endPoint = '/user';
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl, customHeaders);
  return promise;
}

/**
 * Get details of a plan
 *
 * @description Get limit and prices of a plan.
 * @param {string} planName
 */
function getPlan(planName: string, customHeaders?: HeadersInit): Promise<unknown> {
  if (planName === undefined) {
    throw new Error('Plan name is undefined');
  }

  const endPoint = `/system/plan/${planName}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl, customHeaders);
  return promise;
}

/**
 * Forms
 */

type GetFormsQuery = {
  /**
   * Filters the query results to fetch a specific form range.
   *
   * @example {"new":"1"}
   * @example {"created_at:gt":"2013-01-01 00:00:00"}
   */
  filter?: Filter;
  /**
   * Start of each result set for form list. Useful for pagination.
   *
   * @default 0
   * @example 20
   */
  offset?: number;
  /**
   * Number of results in each result set for form list. Maximum is 1000.
   *
   * @default 20
   * @example 30
   */
  limit?: number;
  /**
   * Order results by a form field name: id, username, title, status(ENABLED, DISABLED, DELETED), created_at, updated_at, new (unread submissions count), count (all submissions count), slug (used in form URL).
   *
   * @example 'created_at'
   */
  orderby?: string;
  direction?: 'ASC' | 'DESC';
  fullText?: string;
};

/**
 * Get User Forms
 *
 * @description Get a list of forms for this account. Includes basic details such as title of the form, when it was created, number of new and total submissions.
 * @link https://api.jotform.com/docs/#user-forms
 * @param {GetFormsQuery} [query]
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function getForms(query: GetFormsQuery = {}, customHeaders?: HeadersInit): Promise<unknown> {
  const { filter, offset, limit, orderby, direction, fullText } = query;

  if (filter && typeof filter !== 'object') {
    throw new Error('filter must be an object');
  }

  if (direction && direction !== 'ASC' && direction !== 'DESC') {
    throw new Error("direction must be 'ASC' or 'DESC'");
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

/**
 * Get Form Details
 *
 * @description Get basic information about a form. Use /form/{id}/questions to get the list of questions.
 * @link https://api.jotform.com/docs/#form-id
 * @param {string} formID
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function getForm(formID: string, customHeaders?: HeadersInit): Promise<unknown> {
  if (typeof formID === 'undefined' || formID === null) {
    throw new Error('formID is required');
  }

  const endPoint = `/form/${formID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl, customHeaders);
  return promise;
}

/**
 * Create a new form
 *
 * @description Create new form with questions, properties and email settings.
 * @link https://api.jotform.com/docs/#post-forms
 * @param {unknown} formData
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function createForm(formData: unknown, customHeaders?: HeadersInit): Promise<unknown> {
  if (typeof formData !== 'object' || formData === null) {
    throw new Error('formData must be an object');
  }

  const endPoint = '/user/forms';
  const requestUrl = getRequestUrl(endPoint);
  const postData = formData;

  const promise = post(requestUrl, postData, customHeaders);
  return promise;
}

/**
 * Create new forms
 *
 * @description Create new forms with questions, properties and email settings.
 * @link https://api.jotform.com/docs/#put-forms
 * @param {unknown} formsData
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function createForms(formsData: unknown, customHeaders?: HeadersInit): Promise<unknown> {
  if (typeof formsData === 'undefined' || formsData === null) {
    throw new Error('formsData is required');
  }

  const endPoint = '/user/forms';
  const requestUrl = getRequestUrl(endPoint);
  const postData = formsData;

  const promise = put(requestUrl, postData, customHeaders);
  return promise;
}

/**
 * Delete a form
 *
 * @description Delete an existing form.
 * @link https://api.jotform.com/docs/#delete-form-id
 * @param {string} formID
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function deleteForm(formID: string, customHeaders?: HeadersInit): Promise<unknown> {
  if (typeof formID === 'undefined' || formID === null) {
    throw new Error('formID is required');
  }

  const endPoint = `/form/${formID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = del(requestUrl, customHeaders);
  return promise;
}

/**
 * Clone Form
 *
 * @description Clone a single form.
 * @link https://api.jotform.com/docs/#post-form-id-clone
 * @param {string} formID
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function cloneForm(formID: string, customHeaders?: HeadersInit): Promise<unknown> {
  if (typeof formID === 'undefined' || formID === null) {
    throw new Error('formID is required');
  }

  const endPoint = `/form/${formID}/clone`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = post(requestUrl, customHeaders);
  return promise;
}

/**
 * Form files
 */

/**
 * Get Form Uploads
 *
 * @description List of files uploaded on a form. Size and file type is also included.
 * @link https://api.jotform.com/docs/#form-id-files
 * @param {string} formID
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function getFormFiles(formID: string, customHeaders?: HeadersInit): Promise<unknown> {
  if (typeof formID === 'undefined' || formID === null) {
    throw new Error('formID is required');
  }

  const endPoint = `/form/${formID}/files`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl, customHeaders);
  return promise;
}

/**
 * Form properties
 */

/**
 * Get Form Properties
 *
 * @description Get a list of all properties on a form.
 * @link https://api.jotform.com/docs/#form-id-properties
 * @param {string} formID
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function getFormProperties(formID: string, customHeaders?: HeadersInit): Promise<unknown> {
  if (typeof formID === 'undefined' || formID === null) {
    throw new Error('formID is required');
  }

  const endPoint = `/form/${formID}/properties`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl, customHeaders);
  return promise;
}

/**
 * Get a Form Property
 *
 * @description Get a specific property of the form.
 * @link https://api.jotform.com/docs/#form-id-properties-key
 * @param {string} formID
 * @param {string} key
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function getFormProperty(
  formID: string,
  key: string,
  customHeaders?: HeadersInit,
): Promise<unknown> {
  if (typeof formID === 'undefined' || formID === null) {
    throw new Error('formID is required');
  }

  const endPoint = `/form/${formID}/properties/${key}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl, customHeaders);
  return promise;
}

/**
 * Add or edit properties of a specific form
 *
 * @description Edit a form property or add a new one.
 * @link https://api.jotform.com/docs/#post-form-id-properties
 * @param {string} formID
 * @param {unknown} propertyData
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function addFormProperty(
  formID: string,
  propertyData: unknown,
  customHeaders?: HeadersInit,
): Promise<unknown> {
  if (typeof formID === 'undefined' || formID === null) {
    throw new Error('formID is required');
  }

  if (typeof propertyData !== 'object' || propertyData === null) {
    throw new Error('propertyData must be an object');
  }

  const endPoint = `/form/${formID}/properties`;
  const requestUrl = getRequestUrl(endPoint);
  const postData = propertyData;

  const promise = post(requestUrl, postData, customHeaders);
  return promise;
}

/**
 * Add or edit properties of a specific form
 *
 * @description Edit a form property or add a new one.
 * @link https://api.jotform.com/docs/#put-form-id-properties
 * @param {string} formID
 * @param {unknown} propertyData
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function addFormProperties(
  formID: string,
  propertyData: unknown,
  customHeaders?: HeadersInit,
): Promise<unknown> {
  if (typeof formID === 'undefined' || formID === null) {
    throw new Error('formID is required');
  }

  if (typeof propertyData !== 'object' || propertyData === null) {
    throw new Error('propertyData must be an object');
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

/**
 * Get Form Questions
 *
 * @description Get a list of all questions on a form. Type describes question field type. Order is the question order in the form. Text field is the question label.
 * @link https://api.jotform.com/docs/#form-id-questions
 * @param {string} formID
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function getFormQuestions(formID: string, customHeaders?: HeadersInit): Promise<unknown> {
  if (typeof formID === 'undefined' || formID === null) {
    throw new Error('formID is required');
  }

  const endPoint = `/form/${formID}/questions`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl, customHeaders);
  return promise;
}

/**
 * Get Details About a Question
 *
 * @description Form questions might have various properties. Examples: Is it required? Are there any validations such as 'numeric only'?
 * @link https://api.jotform.com/docs/#form-id-question-id
 * @param {string} formID
 * @param {string} questionID
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function getFormQuestion(
  formID: string,
  questionID: string,
  customHeaders?: HeadersInit,
): Promise<unknown> {
  if (typeof formID === 'undefined' || formID === null) {
    throw new Error('formID is required');
  }

  if (typeof questionID === 'undefined' || questionID === null) {
    throw new Error('questionID is required');
  }

  const endPoint = `/form/${formID}/question/${questionID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl, customHeaders);
  return promise;
}

/**
 * Add new question to specified form
 *
 * @description Add new question to specified form. Form questions might have various properties. Examples: Is it required? Are there any validations such as 'numeric only'?
 * @link https://api.jotform.com/docs/#post-form-id-questions
 * @param {string} formID
 * @param {unknown} questionData
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function addFormQuestion(
  formID: string,
  questionData: unknown,
  customHeaders?: HeadersInit,
): Promise<unknown> {
  if (typeof formID === 'undefined' || formID === null) {
    throw new Error('formID is required');
  }

  if (typeof questionData !== 'object' || questionData === null) {
    throw new Error('questionData must be an object');
  }

  const endPoint = `/form/${formID}/questions`;
  const requestUrl = getRequestUrl(endPoint);
  const postData = questionData;

  const promise = post(requestUrl, postData, customHeaders);
  return promise;
}

/**
 * Add new questions to specified form
 *
 * @description Add new questions to specified form. Form questions might have various properties. Examples: Is it required? Are there any validations such as 'numeric only'?
 * @link https://api.jotform.com/docs/#put-form-id-questions
 * @param {string} formID
 * @param {unknown} questionData
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function addFormQuestions(
  formID: string,
  questionData: unknown,
  customHeaders?: HeadersInit,
): Promise<unknown> {
  if (typeof formID === 'undefined' || formID === null) {
    throw new Error('formID is required');
  }

  if (typeof questionData !== 'object' || questionData === null) {
    throw new Error('questionData must be an object');
  }

  const endPoint = `/form/${formID}/questions`;
  const requestUrl = getRequestUrl(endPoint);
  const postData = questionData;

  const promise = put(requestUrl, postData, customHeaders);
  return promise;
}

/**
 * Delete Form Question
 *
 * @description Delete a single form question.
 * @link https://api.jotform.com/docs/#delete-form-id-question-id
 * @param {string} formID
 * @param {string} questionID
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function deleteFormQuestion(
  formID: string,
  questionID: string,
  customHeaders?: HeadersInit,
): Promise<unknown> {
  if (typeof formID === 'undefined' || formID === null) {
    throw new Error('formID is required');
  }

  if (typeof questionID === 'undefined' || questionID === null) {
    throw new Error('questionID is required');
  }

  const endPoint = `/form/${formID}/question/${questionID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = del(requestUrl, customHeaders);
  return promise;
}

/**
 * Form reports
 */

/**
 * Get form reports
 *
 * @description Get all the reports of a specific form.
 * @link https://api.jotform.com/docs/#form-id-reports
 * @param {string} formID
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function getFormReports(formID: string, customHeaders?: HeadersInit): Promise<unknown> {
  if (typeof formID === 'undefined' || formID === null) {
    throw new Error('formID is required');
  }

  const endPoint = `/form/${formID}/reports`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl, customHeaders);
  return promise;
}

/**
 * Get Report Details
 *
 * @description Get more information about a data report.
 * @link https://api.jotform.com/docs/#report-id
 * @param {string} formID
 * @param {string} reportID
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function getFormReport(
  formID: string,
  reportID: string,
  customHeaders?: HeadersInit,
): Promise<unknown> {
  return getReport(reportID, customHeaders);
}

/**
 * Create report
 *
 * @description Create new report of a form with intended fields, type and title.
 * @link https://api.jotform.com/docs/#post-form-id-reports
 * @param {string} formID
 * @param {unknown} reportData
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function createFormReport(
  formID: string,
  reportData: unknown,
  customHeaders?: HeadersInit,
): Promise<unknown> {
  if (typeof formID === 'undefined' || formID === null) {
    throw new Error('formID is required');
  }

  if (typeof reportData !== 'object' || reportData === null) {
    throw new Error('reportData must be an object');
  }

  const endPoint = `/form/${formID}/reports`;
  const requestUrl = getRequestUrl(endPoint);
  const postData = reportData;

  const promise = post(requestUrl, postData, customHeaders);
  return promise;
}

/**
 * Delete Report
 *
 * @description Delete an existing report.
 * @link https://api.jotform.com/docs/#delete-report-id
 * @param {string} formID
 * @param {string} reportID
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function deleteFormReport(
  formID: string,
  reportID: string,
  customHeaders?: HeadersInit,
): Promise<unknown> {
  return deleteReport(reportID, customHeaders);
}

/**
 * Form submissions
 */

type GetFormSubmissionsQuery = {
  /**
   * Filters the query results to fetch a specific submissions range.
   *
   * @example {"id:gt":"31974353596870"}
   * @example {"created_at:gt":"2013-01-01 00:00:00"}
   * @example {"workflowStatus:ne":"Approve"}
   */
  filter?: Filter;
  /**
   * Start of each result set for form list. Useful for pagination.
   *
   * @default 0
   * @example 20
   */
  offset?: number;
  /**
   * Number of results in each result set for form list. Maximum is 1000.
   *
   * @default 20
   * @example 30
   */
  limit?: number;
  /**
   * Order results by a form field name: id, username, title, status(ENABLED, DISABLED, DELETED), created_at, updated_at, new (unread submissions count), count (all submissions count), slug (used in form URL).
   *
   * @example 'created_at'
   */
  orderby?: string;
  direction?: 'ASC' | 'DESC';
};

/**
 * Get Form Submissions
 *
 * @description List of form responses. answers array has the submitted data. Created_at is the date of the submission.
 * @link https://api.jotform.com/docs/#form-id-submissions
 * @param {string} formID
 * @param {GetFormSubmissionsQuery} [query]
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function getFormSubmissions(
  formID: string,
  query: GetFormSubmissionsQuery = {},
  customHeaders?: HeadersInit,
): Promise<unknown> {
  if (typeof formID === 'undefined' || formID === null) {
    throw new Error('formID is required');
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

/**
 * Get Submission Data
 *
 * @description Similar to /form/{form-id}/submissions. But only get a single submission.
 * @link https://api.jotform.com/docs/#submission-id
 * @param {string} formID
 * @param {string} submissionID
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function getFormSubmission(
  formID: string,
  submissionID: string,
  customHeaders?: HeadersInit,
): Promise<unknown> {
  return getSubmission(submissionID, customHeaders);
}

/**
 * Add a Submission to the Form
 *
 * @description Submit data to this form using the API. You should get a list of question IDs from form/{id}/questions and send the submission data with qid.
 * @link https://api.jotform.com/docs/#post-form-id-submissions
 * @param {string} formID
 * @param {unknown} submissionData
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function createFormSubmission(
  formID: string,
  submissionData: unknown,
  customHeaders?: HeadersInit,
): Promise<unknown> {
  if (typeof formID === 'undefined' || formID === null) {
    throw new Error('formID is required');
  }

  if (typeof submissionData !== 'object' || submissionData === null) {
    throw new Error('submissionData must be an object');
  }

  const endPoint = `/form/${formID}/submissions`;
  const requestUrl = getRequestUrl(endPoint);
  const postData = submissionData;

  const promise = post(requestUrl, postData, customHeaders);
  return promise;
}

/**
 * Add Submissions to the Form
 *
 * @description Submit data to this form using the API. You should get a list of question IDs from form/{id}/questions and send the submission data with qid.
 * @link https://api.jotform.com/docs/#put-form-id-submissions
 * @param {string} formID
 * @param {unknown} submissionsData
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function createFormSubmissions(
  formID: string,
  submissionsData: unknown,
  customHeaders?: HeadersInit,
): Promise<unknown> {
  if (typeof formID === 'undefined' || formID === null) {
    throw new Error('formID is required');
  }

  if (typeof submissionsData !== 'object' || submissionsData === null) {
    throw new Error('submissionsData must be an object');
  }

  const endPoint = `/form/${formID}/submissions`;
  const requestUrl = getRequestUrl(endPoint);
  const postData = submissionsData;

  const promise = put(requestUrl, postData, customHeaders);
  return promise;
}

/**
 * Delete Submission Data
 *
 * @description Delete a single submission.
 * @link https://api.jotform.com/docs/#delete-submission-id
 * @param {string} formID
 * @param {string} submissionID
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function deleteFormSubmission(
  formID: string,
  submissionID: string,
  customHeaders?: HeadersInit,
): Promise<unknown> {
  return deleteSubmission(submissionID, customHeaders);
}

/**
 * Form webhooks
 */

/**
 * List of Webhooks for a Form
 *
 * @description Webhooks can be used to send form submission data as an instant notification. Returns list of webhooks for this form.
 * @link https://api.jotform.com/docs/#form-id-webhooks
 * @param {string} formID
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function getFormWebhooks(formID: string, customHeaders?: HeadersInit): Promise<unknown> {
  if (typeof formID === 'undefined' || formID === null) {
    throw new Error('formID is required');
  }

  const endPoint = `/form/${formID}/webhooks`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl, customHeaders);
  return promise;
}

/**
 * Add a New Webhook
 *
 * @description Webhooks can be used to send form submission data as an instant notification.
 * @link https://api.jotform.com/docs/#post-form-id-webhooks
 * @param {string} formID
 * @param {string} webhookURL
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function createFormWebhook(
  formID: string,
  webhookURL: string,
  customHeaders?: HeadersInit,
): Promise<unknown> {
  if (typeof formID === 'undefined' || formID === null) {
    throw new Error('formID is required');
  }

  if (typeof webhookURL === 'undefined' || webhookURL === null) {
    throw new Error('webhookURL is required');
  }

  const endPoint = `/form/${formID}/webhooks`;
  const requestUrl = getRequestUrl(endPoint);
  const postData = {
    webhookURL: webhookURL,
  };

  const promise = post(requestUrl, postData, customHeaders);
  return promise;
}

/**
 * Delete a webhook of a specific form
 *
 * @description Delete a webhook of a specific form
 * @link https://api.jotform.com/docs/#delete-form-id-webhooks
 * @param {string} formID
 * @param {string} webhookID
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function deleteFormWebhook(
  formID: string,
  webhookID: string,
  customHeaders?: HeadersInit,
): Promise<unknown> {
  if (typeof formID === 'undefined' || formID === null) {
    throw new Error('formID is required');
  }

  if (typeof webhookID === 'undefined' || webhookID === null) {
    throw new Error('webhookID is required');
  }

  const endPoint = `/form/${formID}/webhooks/${webhookID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = del(requestUrl, customHeaders);
  return promise;
}

/**
 * Folders
 */

/**
 * Get User Folders
 *
 * @description Get a list of form folders for this account. Returns name of the folder and owner of the folder for shared folders.
 * @link https://api.jotform.com/docs/#user-folders
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function getFolders(customHeaders?: HeadersInit): Promise<unknown> {
  const endPoint = '/user/folders';
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl, customHeaders);
  return promise;
}

/**
 * Get Folder Details
 *
 * @description Get a list of forms in a folder, and other details about the form such as folder color.
 * @link https://api.jotform.com/docs/#folder-id
 * @param {string} folderID
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>
 */
function getFolder(folderID: string, customHeaders?: HeadersInit): Promise<unknown> {
  if (typeof folderID === 'undefined' || folderID === null) {
    throw new Error('folderID is required');
  }

  const endPoint = `/folder/${folderID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl, customHeaders);
  return promise;
}

/**
 * Create Folder
 *
 * @description Create a folder with specified parameters
 * @link https://api.jotform.com/docs/#post-folder
 * @param {unknown} folderProperties
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function createFolder(folderProperties: unknown, customHeaders?: HeadersInit): Promise<unknown> {
  if (typeof folderProperties !== 'object' || folderProperties === null) {
    throw new Error('folderProperties must be an object');
  }

  const endPoint = '/folder';
  const requestUrl = getRequestUrl(endPoint);
  const postData = folderProperties;

  const promise = post(requestUrl, postData, customHeaders);
  return promise;
}

/**
 * Update Folder
 *
 * @description Update a folder with specified parameters. Also you can add forms to the folder.
 * @link https://api.jotform.com/docs/#put-folder-id
 * @param {string} folderID
 * @param {unknown} folderProperties
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function updateFolder(
  folderID: string,
  folderProperties: unknown,
  customHeaders?: HeadersInit,
): Promise<unknown> {
  if (typeof folderID === 'undefined' || folderID === null) {
    throw new Error('folderID is required');
  }

  if (typeof folderProperties !== 'object' || folderProperties === null) {
    throw new Error('folderProperties must be an object');
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
  if (typeof folderID === 'undefined' || folderID === null) {
    throw new Error('folderID is required');
  }

  if (typeof formID === 'undefined' || formID === null) {
    throw new Error('formID is required');
  }

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
  if (typeof folderID === 'undefined' || folderID === null) {
    throw new Error('folderID is required');
  }

  if (typeof formIDs === 'undefined' || formIDs === null) {
    throw new Error('formID is required');
  }

  const folderProperties = {
    forms: formIDs,
  };

  return updateFolder(folderID, folderProperties, customHeaders);
}

/**
 * Delete Folder
 *
 * @description Delete a folder and its subfolders
 * @link https://api.jotform.com/docs/#delete-folder-id
 * @param {string} folderID
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function deleteFolder(folderID: string, customHeaders?: HeadersInit): Promise<unknown> {
  if (typeof folderID === 'undefined' || folderID === null) {
    throw new Error('folderID is required');
  }

  const endPoint = `/folder/${folderID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = del(requestUrl, customHeaders);
  return promise;
}

/**
 * Reports
 */

/**
 * Get User Reports
 *
 * @description List of URLs for reports in this account. Includes reports for all of the forms. ie. Excel, CSV, printable charts, embeddable HTML tables.
 * @link https://api.jotform.com/docs/#user-reports
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function getReports(customHeaders?: HeadersInit): Promise<unknown> {
  const endPoint = '/user/reports';
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl, customHeaders);
  return promise;
}

/**
 * Get Report Details
 *
 * @description Get more information about a data report.
 * @link https://api.jotform.com/docs/#report-id
 * @param {string} reportID
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function getReport(reportID: string, customHeaders?: HeadersInit): Promise<unknown> {
  if (typeof reportID === 'undefined' || reportID === null) {
    throw new Error('reportID is required');
  }

  const endPoint = `/report/${reportID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl, customHeaders);
  return promise;
}

/**
 * Delete a Report
 *
 * @description Delete an existing report.
 * @link https://api.jotform.com/docs/#delete-report-id
 * @param {string} reportID
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function deleteReport(reportID: string, customHeaders?: HeadersInit): Promise<unknown> {
  if (typeof reportID === 'undefined' || reportID === null) {
    throw new Error('reportID is required');
  }

  const endPoint = `/report/${reportID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = del(requestUrl, customHeaders);
  return promise;
}

/**
 * Submissions
 */

type GetSubmissionsQuery = {
  /**
   * Filters the query results to fetch a specific submissions range.
   *
   * @example {"new":"1"}
   * @example {"created_at:gt":"2013-01-01 00:00:00"}
   * @example {"formIDs":["your-form-id","your-form-id#2"]}
   * @example {"fullText":"John Brown"}
   */
  filter?: Filter;
  /**
   * Start of each result set for submission data. Useful for pagination.
   *
   * @default 0
   * @example 20
   */
  offset?: number;
  /**
   * Number of results in each result set for submission data. Maximum is 1000.
   *
   * @default 20
   * @example 30
   */
  limit?: number;
  /**
   * Order results by a submission field name.
   *
   * @example 'created_at'
   */
  orderby?: 'id' | 'form_id' | 'IP' | 'created_at' | 'status' | 'new' | 'flag' | 'updated_at';
  direction?: 'ASC' | 'DESC';
  fullText?: string;
  nocache?: string;
};

/**
 * Get User Submissions
 *
 * @description Get a list of all submissions for all forms on this account. The answers array has the submission data. Created_at is the date of the submission.
 * @link https://api.jotform.com/docs/#user-submissions
 * @param {GetSubmissionsQuery} [query]
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function getSubmissions(
  query: GetSubmissionsQuery = {},
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

/**
 * Get Submission Data
 *
 * @description Similar to /form/{form-id}/submissions. But only get a single submission.
 * @link https://api.jotform.com/docs/#submission-id
 * @param {string} submissionID
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function getSubmission(submissionID: string, customHeaders?: HeadersInit): Promise<unknown> {
  if (typeof submissionID === 'undefined' || submissionID === null) {
    throw new Error('submissionID is required');
  }

  const endPoint = `/submission/${submissionID}`;
  const requestUrl = getRequestUrl(endPoint);

  const promise = get(requestUrl, customHeaders);
  return promise;
}

/**
 * Edit Submission Data
 *
 * @description Edit a single submission.
 * @link https://api.jotform.com/docs/#post-submission-id
 * @param {string} submissionID
 * @param {unknown} submissionData
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function updateSubmission(
  submissionID: string,
  submissionData: unknown,
  customHeaders?: HeadersInit,
): Promise<unknown> {
  if (typeof submissionID === 'undefined' || submissionID === null) {
    throw new Error('submissionID is required');
  }

  if (typeof submissionData !== 'object' || submissionData === null) {
    throw new Error('submissionData must be an object');
  }

  const endPoint = `/submission/${submissionID}`;
  const requestUrl = getRequestUrl(endPoint);
  const postData = submissionData;

  const promise = post(requestUrl, postData, customHeaders);
  return promise;
}

/**
 * Delete Submission Data
 *
 * @description Delete a single submission.
 * @link https://api.jotform.com/docs/#delete-submission-id
 * @param {string} submissionID
 * @param {HeadersInit} [customHeaders]
 * @returns {Promise<unknown>}
 */
function deleteSubmission(submissionID: string, customHeaders?: HeadersInit): Promise<unknown> {
  if (typeof submissionID === 'undefined' || submissionID === null) {
    throw new Error('submissionID is required');
  }

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
  getPlan,

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
