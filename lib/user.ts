import { AxiosInstance } from "axios";
import { JotformResponse } from './types/response.ts';
import { PaginationParameters } from "./interfaces/request.ts";
import { LoginOptions, UserHistoryOptions } from "./interfaces/user.ts";

export default class User {
  
  client: AxiosInstance;
  
  constructor(client: AxiosInstance) {
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
    return this.client.post('/user/register', {
      username,
      password,
      email,
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }

  login(username: string, password: string, optionalParameters?: LoginOptions): JotformResponse {
    return this.client.post('/user/login', {
      username,
      password,
      ...optionalParameters,
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }

  logout(): JotformResponse {
    return this.client.get('/v1/user/logout');
  }

  getSettings(): JotformResponse {
    return this.client.get('/user/settings');
  }

  updateSettings(settings: Record<string, unknown>): JotformResponse {
    return this.client.post('/user/settings', {
      ...settings
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }

  getHistory(options?: UserHistoryOptions): JotformResponse {
    return this.client.post('/user/history', options, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }

  getForms(pagination?: PaginationParameters): JotformResponse {
    return this.client.get('/user/forms', {
      params: {
        ...pagination
      }
    });
  }

  createForm(parameters: FormParameters): JotformResponse {
    return this.client.post('/user/forms', {
      ...parameters
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }

  createFormJSON(parameters: FormParameters): JotformResponse {
    return this.client.put('/user/forms', parameters);
  }
}
