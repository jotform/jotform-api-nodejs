import axios, { Method } from 'axios';

export type IClient = InstanceType<typeof Client>;

export class Client {
  private defaultHeaders: object;

  constructor() {
    this.defaultHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      timeout: 20000,
    };
    this.setAxios();
  }

  private setAxios = (): void => {
    axios.defaults.baseURL = 'https://api.jotform.com';
  };

  setApiKey = (apiKey: string): void => {
    axios.defaults.headers = { ...this.defaultHeaders, APIKEY: apiKey };
  };

  Request = (method: Method, path: string, data?: object): Promise<object> => {
    return new Promise((resolve, reject) => {
      axios({
        url: path,
        method: method,
        data: data,
      })
        .then((response) => {
          if (response.data.responseCode !== 200) {
            reject(response.data.message);
          }

          resolve(response.data);
        })
        .catch((error) => reject(error.response.data));
    });
  };
}
