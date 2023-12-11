import { AxiosInstance } from "axios";

export default class Form {
  
  client: AxiosInstance;
  
  constructor(client: AxiosInstance) {
    this.client = client;
  }

  
}
