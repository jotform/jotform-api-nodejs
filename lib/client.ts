import axios, { AxiosError, AxiosInstance } from "axios";
import { ClientOptions } from "./interfaces/client.ts";
import { DefaultOptions } from "./constants/clientOptions.ts";
import { startsWith2 } from "./utils.ts";

export default function createClient(apiKey: string, opt: ClientOptions): AxiosInstance {
  const options: ClientOptions = {...DefaultOptions, ...opt};

  if (!apiKey) {
    throw new Error('"apiKey" is a required parameter to use Jotform Client.');
  }

  const instance = axios.create({
    baseURL: options.baseURL,
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

  return instance;
}
