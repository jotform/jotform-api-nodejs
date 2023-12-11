import { AxiosInstance } from "axios";
import { JotformResponse } from './types/response';

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

}
