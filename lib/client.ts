import axios, { AxiosError, AxiosInstance } from "axios";
import { ClientOptions } from "./interfaces/client";
import { DefaultOptions } from "./constants/clientOptions";
import { startsWith2 } from "./utils";
import { RequestConfig } from "./interfaces/request";
import { JotformResponse } from "./types/response";
import { Json } from "./types/common";

export default class Client {

  apiKey: string;
  options: ClientOptions;
  inner: AxiosInstance;

  constructor(apiKey: string, opt?: ClientOptions) {
    this.apiKey = apiKey;
    this.options = {...DefaultOptions, ...opt};

    if (!apiKey) {
      throw new Error('"apiKey" is a required parameter to use Jotform Client.');
    }

    const instance = axios.create({
      baseURL: this.options.baseURL,
      params: {
        apiKey
      }
    });

    instance.interceptors.response.use(resp => {
      if (resp.data.responseCode) {
        const code = resp.data.responseCode;
        if (!startsWith2(code)) {
          throw new AxiosError(resp.data.message || 'Error occurred!', code);
        }
      }
      return resp.data;
    });

    this.inner = instance;

  }

  get(url: string, config?: RequestConfig): JotformResponse {
    return this.inner.get(url, config);
  }
  
  post(url: string, body?: Json, config?: RequestConfig): JotformResponse {
    return this.inner.post(url, body, config);
  }

  postForm(url: string, body?: Json, config?: RequestConfig): JotformResponse {
    return this.inner.post(url, body, {...config, headers: {
      ...config?.headers,
      'Content-Type': 'application/x-www-form-urlencoded',
    }});
  }

  put(url: string, body?: Json, config?: RequestConfig): JotformResponse {
    return this.inner.put(url, body, config);
  }

  delete(url: string, config?: RequestConfig): JotformResponse {
    return this.inner.delete(url, config);
  }
  
}
