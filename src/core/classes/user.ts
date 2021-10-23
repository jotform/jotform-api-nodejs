import { IClient } from '../client';

interface IUser {
  getUser(): Promise<object>;
  getUsage(): Promise<object>;
  getForms(): Promise<object>;
  getSubmissions(
    offset?: number,
    limit?: number,
    filter?: object,
    orderby?: string,
    direction?: string,
    nocache?: string
  ): Promise<object>;
  getSubusers(): Promise<object>;
  getFolders(): Promise<object>;
  getSettings(): Promise<object>;
  getReports(): Promise<object>;
  getHistory(): Promise<object>;
  registerUser(
    username: string,
    password: string,
    email: string
  ): Promise<object>;
  updateUserSettings(data: {
    name?: string;
    email?: string;
    website?: string;
    time_zone?: string;
    company?: string;
    securityQuestion?: string;
    securityAnswer?: string;
    industry?: string;
  }): Promise<object>;
}

export class User implements IUser {
  private client: IClient;

  constructor(client: IClient) {
    this.client = client;
  }

  /**
   * Get user account details for this Jotform user. Including user account type, avatar URL, name, email, website URL and account limits.
   */
  getUser = (): Promise<object> => {
    return this.client.Request('GET', '/user');
  };

  /**
   * Get number of form submissions received this month. Also, get number of SSL form submissions, payment form submissions and upload space used by user.
   */
  getUsage = (): Promise<object> => {
    return this.client.Request('GET', '/user/usage');
  };

  /**
   * Get a list of forms for this account. Includes basic details such as title of the form, when it was created, number of new and total submissions.
   */
  getForms = (): Promise<object> => {
    return this.client.Request('GET', '/user/forms');
  };

  /**
   * Get a list of all submissions for all forms on this account. The answers array has the submission data. Created_at is the date of the submission.
   * @param offset Start of each result set for submission data. Useful for pagination. Default: 0.
   * @param limit Number of results in each result set for submission data. Default is 20.
   * @param filter Filters the query results to fetch a specific submissions range. Example: {"created_at:gt":"2013-01-01 00:00:00"} Example: {"formIDs":["your-form-id","your-form-id#2"]} Example: {"fullText":"John Brown"}
   * @param orderby Order results by a submission field name: id, form_id, IP, created_at, status, new, flag, updated_at.
   * @param direction ASC (ascending) or DESC (descending)
   * @param nocache No cache. True | False.
   */
  getSubmissions = (
    offset?: number,
    limit?: number,
    filter?: object,
    orderby?: string,
    direction?: string,
    nocache?: string
  ): Promise<object> => {
    return this.client.Request(
      'GET',
      `/user/submissions?filter=${filter || ''}&offset=${offset || ''}&limit${
        limit || ''
      }&orderby=${orderby || ''}&nocache=${nocache || ''}&direction=${
        direction || ''
      }`
    );
  };

  /**
   * Get a list of sub users for this accounts and list of forms and form folders with access privileges.
   */
  getSubusers = (): Promise<object> => {
    return this.client.Request('GET', '/user/subusers');
  };

  /**
   * Get a list of form folders for this account. Returns name of the folder and owner of the folder for shared folders.
   */
  getFolders = (): Promise<object> => {
    return this.client.Request('GET', '/user/folders');
  };

  /**
   * Get user's time zone and language.
   */
  getSettings = (): Promise<object> => {
    return this.client.Request('GET', '/user/settings');
  };

  /**
   * List of URLS for reports in this account. Includes reports for all of the forms. ie. Excel, CSV, printable charts, embeddable HTML tables.
   */
  getReports = (): Promise<object> => {
    return this.client.Request('GET', '/user/reports');
  };

  /**
   * User activity log about things like forms created/modified/deleted, account logins and other operations.
   */
  getHistory = (): Promise<object> => {
    return this.client.Request('GET', '/user/history');
  };

  /**
   * Register a new user with username, password and email.
   * @param username Username.
   * @param password Password.
   * @param email Email.
   */
  registerUser = (
    username: string,
    password: string,
    email: string
  ): Promise<object> => {
    const params = new URLSearchParams({
      username: username,
      password: password,
      email: email,
    });

    return this.client.Request('POST', '/user/register', params);
  };

  /**
   * Update user's settings like time zone and language.
   * @param data
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
  updateUserSettings = (data: {
    name?: string;
    email?: string;
    website?: string;
    time_zone?: string;
    company?: string;
    securityQuestion?: string;
    securityAnswer?: string;
    industry?: string;
  }): Promise<object> => {
    const params = new URLSearchParams(data);

    return this.client.Request('POST', '/user/settings', params);
  };
}
