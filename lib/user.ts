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

  get(): JotformResponse {
    return this.client.get('/user');
  }

  getUsage(): JotformResponse {
    return this.client.get('/user/usage');
  }

  getSubmissions(pagination?: PaginationParameters): JotformResponse {
    return this.client.get('/user/submissions', {
      params: {
        ...pagination
      }
    });
  }

  getSubUsers(): JotformResponse {
    return this.client.get('/user/subusers');
  }

  getFolders(): JotformResponse {
    return this.client.get('/user/folders');
  }

  getReports(): JotformResponse {
    return this.client.get('/user/reports');
  }

  register(username: string, password: string, email: string): JotformResponse {
    return this.client.postForm('/user/register', {
      username,
      password,
      email,
    });
  }

  login(username: string, password: string, optionalParameters?: LoginOptions): JotformResponse {
    return this.client.postForm('/user/login', {
      username,
      password,
      ...optionalParameters,
    });
  }

  logout(): JotformResponse {
    return this.client.get('/v1/user/logout');
  }

  getSettings(): JotformResponse {
    return this.client.get('/user/settings');
  }

  updateSettings(settings: Record<string, unknown>): JotformResponse {
    return this.client.postForm('/user/settings', {
      ...settings
    });
  }

  getHistory(options?: UserHistoryOptions): JotformResponse {
    return this.client.postForm('/user/history', options);
  }

  getForms(pagination?: PaginationParameters): JotformResponse {
    return this.client.get('/user/forms', {
      params: {
        ...pagination
      }
    });
  }

  createForm(parameters?: FormParameters): JotformResponse {
    return this.client.postForm('/user/forms', {
      ...parameters
    });
  }

  createFormJSON(parameters: FormParameters): JotformResponse {
    return this.client.put('/user/forms', parameters);
  }
}
