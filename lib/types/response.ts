export type Response<T> = {
  responseCode: number;
  message: string;
  content: T;
  'limit-left': number;
  duration: string;
};

export type JotformResponse = Promise<Response<Record<string, unknown>>>;
