import axios, { Method } from 'axios';

export type IClient = InstanceType<typeof Client>;

export class Client {
  private defaultHeaders: object;
  public instanceTypes: { [key: string]: string };

  constructor() {
    this.instanceTypes = {
      US: 'https://api.jotform.com',
      EU: 'https://eu-api.jotform.com',
      HIPAA: 'https://hipaa-api.jotform.com',
    };
    this.defaultHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      timeout: 20000,
    };
  }

  initializeSDK = (apiKey: string, instanceType: string): void => {
    axios.defaults.baseURL = this.instanceTypes[instanceType];
    axios.defaults.headers = { ...this.defaultHeaders, APIKEY: apiKey };
  };

  Request = (method: Method, path: string, data?: object): Promise<object> => {
    if (!axios.defaults.headers['APIKEY']) {
      throw new Error(
        'SDK must be initialized with your API Key and initializeSDK method first.'
      );
    }

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
