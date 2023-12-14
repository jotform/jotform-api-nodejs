import Client from "./client";
import { Json } from "./types/common";
import { JotformResponse } from "./types/response";

export default class Submission {
    
  client: Client;
  
  constructor(client: Client) {
    this.client = client;
  }

  /**
   * Similar to **form.getSubmissions**. But only gets a single submission.
   * @param submissionId Submission ID.
   */
  get(submissionId: string): JotformResponse {
    return this.client.get(`/submission/${submissionId}`);
  }

  /**
   * Edit a single submission.
   * @param submissionId Submission ID.
   * @param submissionData Submission data.
   */
  edit(submissionId: string, submissionData: Json): JotformResponse {
    return this.client.postForm(`/submission/${submissionId}`, {
      submission: submissionData,
    });
  }

  /**
   * Delete a single submission.
   * @param submissionId Submission ID.
   */
  delete(submissionId: string): JotformResponse {
    return this.client.delete(`/submission/${submissionId}`);
  }

}