import { IClient } from '../client';

interface IReport {
  getReport(reportId: string): Promise<object>;
  deleteReport(reportId: string): Promise<object>;
}

export class Report implements IReport {
  private client: IClient;

  constructor(client: IClient) {
    this.client = client;
  }

  /**
   * Get more information about a data report.
   * @param reportId Report ID.
   */
  getReport = (reportId: string): Promise<object> => {
    return this.client.Request('GET', `/report/${reportId}`);
  };

  /**
   * Delete an existing report.
   * @param reportId Report ID.
   */
  deleteReport = (reportId: string): Promise<object> => {
    return this.client.Request('DELETE', `/report/${reportId}`);
  };
}
