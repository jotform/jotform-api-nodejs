import { JotformResponse } from './types/response.ts';
import { PaginationParameters } from "./interfaces/request.ts";
import { LoginOptions, UserHistoryOptions } from "./interfaces/user.ts";
import { FormParameters } from "./interfaces/form.ts";
import Client from "./client.ts";

export default class User {
  
  client: Client;
  
  constructor(client: Client) {
    this.client = client;
  }

  /**
   * Get user account details for this Jotform user. Including user account type, avatar URL, name, email, website URL and account limits.
   */
  get(): JotformResponse {
    return this.client.get('/user');
  }

  /**
   * Get number of form submissions received this month. Also, get number of SSL form submissions, payment form submissions and upload space used by user.
   */
  getUsage(): JotformResponse {
    return this.client.get('/user/usage');
  }

  /**
   * Get a list of all submissions for all forms on this account. The answers array has the submission data. created_at is the date of the submission.
   * @param pagination Pagination parameters
   * @param pagination.offset Start of each result set for submission data. Useful for pagination. Default: 0.
   * @param pagination.limit Number of results in each result set for submission data. Default is 20.
   * @param pagination.filter Filters the query results to fetch a specific submissions range. Example: {"created_at:gt":"2013-01-01 00:00:00"} Example: {"formIDs":["your-form-id","your-form-id#2"]} Example: {"fullText":"John Brown"}
   * @param pagination.orderby Order results by a submission field name: id, form_id, IP, created_at, status, new, flag, updated_at.
   * @param pagination.direction ASC (ascending) or DESC (descending)
   */
  getSubmissions(pagination?: PaginationParameters): JotformResponse {
    return this.client.get('/user/submissions', {
      params: {
        ...pagination
      }
    });
  }

  /**
   * Get a list of sub users for this accounts and list of forms and form folders with access privileges.
   */
  getSubUsers(): JotformResponse {
    return this.client.get('/user/subusers');
  }

  /**
   * Get a list of form folders for this account. Returns name of the folder and owner of the folder for shared folders.
   */
  getFolders(): JotformResponse {
    return this.client.get('/user/folders');
  }

  /**
   * List of URLS for reports in this account. Includes reports for all of the forms. ie. Excel, CSV, printable charts, embeddable HTML tables.
   */
  getReports(): JotformResponse {
    return this.client.get('/user/reports');
  }


  /**
   * Register a new user with username, password and email.
   * @param username Username.
   * @param password Password.
   * @param email Email.
   */
  register(username: string, password: string, email: string): JotformResponse {
    return this.client.postForm('/user/register', {
      username,
      password,
      email,
    });
  }


  /**
   * Login to the user
   * @param username Username.
   * @param password Password.
   */
  login(username: string, password: string, optionalParameters?: LoginOptions): JotformResponse {
    return this.client.postForm('/user/login', {
      username,
      password,
      ...optionalParameters,
    });
  }

  /**
   * Logout
   * @param username Username.
   * @param password Password.
   */
  logout(): JotformResponse {
    return this.client.get('/v1/user/logout');
  }

  /**
   * Get user's time zone and language.
   */
  getSettings(): JotformResponse {
    return this.client.get('/user/settings');
  }

  /**
   * Update user's settings like time zone and language.
   * @param settings
   * @example
   * {
   *  name: "Name",
   *  email: "name@example.com",
   *  website: "http://example.com",
   *  time_zone: "Europe/Istanbul",
   *  company: "Company",
   *  securityQuestion: "Super Secret Secutiy Question?",
   *  securityAnswer: "Ultra Secret Answer",
   *  industry: "Tech",
   * }
   */
  updateSettings(settings: Record<string, unknown>): JotformResponse {
    return this.client.postForm('/user/settings', {
      ...settings
    });
  }

  /**
   * User activity log about things like forms created/modified/deleted, account logins and other operations.
   */
  getHistory(options?: UserHistoryOptions): JotformResponse {
    return this.client.postForm('/user/history', options);
  }

  /**
   * Get a list of forms for this account. Includes basic details such as title of the form, when it was created, number of new and total submissions.
   */
  getForms(pagination?: PaginationParameters): JotformResponse {
    return this.client.get('/user/forms', {
      params: {
        ...pagination
      }
    });
  }

  /**
   * Create a new form
   */
  createForm(parameters?: FormParameters): JotformResponse {
    return this.client.postForm('/user/forms', {
      ...parameters
    });
  }

  /**
   * Create a new form
   */
  createFormJSON(parameters: FormParameters): JotformResponse {
    return this.client.put('/user/forms', parameters);
  }
}
