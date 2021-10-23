import { IClient } from '../client';

interface ISubmission {
  getSubmission(submissionId: string): Promise<object>;
  editSubmission(submissionId: string, data: object): Promise<object>;
  deleteSubmission(submissionId: string): Promise<object>;
}

export class Submission implements ISubmission {
  private client: IClient;

  constructor(client: IClient) {
    this.client = client;
  }

  /**
   * Similar to **getFormSubmissions**. But only get a single submission.
   * @param submissionId Submission ID.
   */
  getSubmission = (submissionId: string): Promise<object> => {
    return this.client.Request('GET', `/submission/${submissionId}`);
  };

  /**
   * Edit a single submission.
   * @param submissionId Submission ID.
   * @param data Submission data.
   */
  editSubmission = (submissionId: string, data: object): Promise<object> => {
    return this.client.Request('POST', `/submission/${submissionId}`, data);
  };

  /**
   * Delete a single submission.
   * @param submissionId Submission ID.
   */
  deleteSubmission = (submissionId: string): Promise<object> => {
    return this.client.Request('DELETE', `/submission/${submissionId}`);
  };
}
