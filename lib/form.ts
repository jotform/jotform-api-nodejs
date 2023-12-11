import { FormParameters, QuestionProperties } from "./interfaces/form.ts";
import { JotformResponse } from "./types/response.ts";
import { ReportParameters } from "./interfaces/report.ts";
import Report from "./report.ts";
import { PaginationParameters } from "./interfaces/request.ts";
import Client from "./client.ts";
import { Json } from "./types/common.ts";

export default class Form {
  
  client: Client;
  
  constructor(client: Client) {
    this.client = client;
  }

  createForm(parameters: FormParameters): JotformResponse {
    return this.client.post('/form', parameters);
  }

  createFormJSON(parameters: FormParameters): JotformResponse {
    return this.client.put('/form', parameters);
  }

  get(id: string): JotformResponse {
    return this.client.get(`/form/${id}`);
  }

  delete(id: string): JotformResponse {
    return this.client.delete(`/form/${id}`);
  }

  clone(id: string): JotformResponse {
    return this.client.post(`/form/${id}/clone`);
  }

  getQuestions(id: string): JotformResponse {
    return this.client.get(`/form/${id}/questions`);
  }

  addQuestion(formId: string, question: QuestionProperties): JotformResponse {
    return this.client.postForm(`/form/${formId}/questions`, {
      question
    });
  }

  addQuestions(formId: string, questions: QuestionProperties[]): JotformResponse {
    return this.client.put(`/form/${formId}/questions`, {
      questions
    });
  }

  getQuestion(formId: string, questionId: string): JotformResponse {
    return this.client.get(`/form/${formId}/question/${questionId}`);
  }

  updateQuestionProperties(formId: string, questionId: string, properties: Json): JotformResponse {
    return this.client.post(`/form/${formId}/question/${questionId}`, {
      question: properties
    });
  }

  deleteQuestion(formId: string, questionId: string): JotformResponse {
    return this.client.delete(`/form/${formId}/question/${questionId}`);
  }

  getProperties(formId: string): JotformResponse {
    return this.client.get(`/form/${formId}/properties`);
  }

  updateProperties(formId: string, properties: Json): JotformResponse {
    return this.client.postForm(`/form/${formId}/properties`, {
      properties
    });
  }

  updatePropertiesJSON(formId: string, properties: Json): JotformResponse {
    return this.client.put(`/form/${formId}/properties`, {
      properties
    });
  }

  getPropertyByKey(formId: string, key: string): JotformResponse {
    return this.client.get(`/form/${formId}/properties/${key}`);
  }

  getReports(formId: string): JotformResponse {
    return this.client.get(`/form/${formId}/reports`);
  }

  createReport(
    formId: string,
    reportParameters: ReportParameters
  ): JotformResponse {
    const { title, type, fields = {} } = reportParameters;

    const serializedParameters = {
      title,
      list_type: type,
      fields: Report.serializeReportFieldsURL(fields),
    };

    return this.client.postForm(`/form/${formId}/reports`, serializedParameters);
  }

  getFiles(formId: string): JotformResponse {
    return this.client.get(`/form/${formId}/files`);
  }

  getWebhooks(formId: string): JotformResponse {
    return this.client.get(`/form/${formId}/webhooks`);
  }
  
  createWebhook(formId: string, webhookURL: string): JotformResponse {
    return this.client.postForm(`/form/${formId}/webhooks`, {
      webhookURL
    });
  }

  deleteWebhook(formId: string, webhookId: string): JotformResponse {
    return this.client.delete(`/form/${formId}/webhooks/${webhookId}`);
  }

  getSubmissions(formId: string, pagination: PaginationParameters): JotformResponse {
    return this.client.get(`/form/${formId}/submissions`, {
      params: {
        ...pagination
      }
    });
  }

  addSubmissions(formId: string, submissionsData: Json[]): JotformResponse {
    return this.client.put(`/form/${formId}/submissions`, submissionsData);
  }

  addSubmission(formId: string, submissionData: Json): JotformResponse {
    return this.client.postForm(`/form/${formId}/submissions`, {
      submission: submissionData,
    });
  }

}
