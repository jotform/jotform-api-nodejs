import Client from "./client";
import { Json } from "./types/common";
import { JotformResponse } from "./types/response";

export default class Submission {
    
  client: Client;
  
  constructor(client: Client) {
    this.client = client;
  }

  get(submissionId: string): JotformResponse {
    return this.client.get(`/submission/${submissionId}`);
  }

  edit(submissionId: string, submissionData: Json): JotformResponse {
    return this.client.postForm(`/submission/${submissionId}`, {
      submission: submissionData,
    });
  }

  delete(submissionId: string): JotformResponse {
    return this.client.delete(`/submission/${submissionId}`);
  }

}