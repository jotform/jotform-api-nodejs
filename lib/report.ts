import Client from "./client";
import { ReportFields } from "./interfaces/report";
import { JotformResponse } from "./types/response";

export default class Report {
    
  client: Client;
  
  constructor(client: Client) {
    this.client = client;
  }

  static serializeReportFieldsURL(fields: ReportFields) {
    const ip = fields.ip ? 'ip' : '';
    const dt = fields.submissionDate ? 'dt' : '';
    const ids = fields.questionIds ? fields.questionIds : [];
    const arr = [ip, dt, ...ids].filter(Boolean);
    return arr.join(',');
  }

  get(reportId: string): JotformResponse {
    return this.client.get(`/report/${reportId}`);
  }

  delete(reportId: string): JotformResponse {
    return this.client.delete(`/report/${reportId}`);
  }

}