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

  /**
   * Creates a new form with supplied parameters such as questions, emails, etc...
   * See: https://api.jotform.com/docs/#post-forms
   * Example usage:
   ```ts
    const response = await client.form.createForm({
      questions: [
        {
          type: 'control_email',
          text: 'This is an email field',
          order: '1',
          name: 'email_field'
        },
        {
          type: 'control_fullname',
          text: 'This is a name field',
          order: '2',
          name: 'name_field'
        }
      ]
    });
    ```
   * @param parameters Form parameters
   * @returns JotformResponse
   */
  createForm(parameters?: FormParameters): JotformResponse {
    return this.client.postForm('/form', parameters);
  }

  /**
   * Creates a new form with supplied parameters such as questions, emails, etc...
   * See: https://api.jotform.com/docs/#put-forms
   * Example usage:
   ```ts
    const response = await client.form.createFormJSON({
      questions: [
        {
          type: 'control_email',
          text: 'This is an email field',
          order: '1',
          name: 'email_field'
        },
        {
          type: 'control_fullname',
          text: 'This is a name field',
          order: '2',
          name: 'name_field'
        }
      ]
    });
    ```
   * @param parameters Form parameters
   * @returns JotformResponse
   */
  createFormJSON(parameters?: FormParameters): JotformResponse {
    return this.client.put('/form', parameters);
  }

  /**
   * Get basic information about a form.
   * @param formId Form ID.
   */
  get(formId: string): JotformResponse {
    return this.client.get(`/form/${formId}`);
  }

  /**
   * Delete an existing form.
   * @param formId Form ID.
   */
  delete(formId: string): JotformResponse {
    return this.client.delete(`/form/${formId}`);
  }

  /**
   * Clone a single form specified by the Form ID.
   * @param formId Form ID
   */
  clone(formId: string): JotformResponse {
    return this.client.post(`/form/${formId}/clone`);
  }

  /**
   * Get a list of all questions on a form. Type describes question field type. Order is the question order in the form. Text field is the question label.
   * @param formId Form ID.
   */
  getQuestions(id: string): JotformResponse {
    return this.client.get(`/form/${id}/questions`);
  }

  /**
   * Add a new question to specified form. Form questions might have various properties. Examples: Is it required? Are there any validations such as 'numeric only'? Detailed information: https://api.jotform.com/docs/#post-form-id-questions
   * @param formId Form ID
   * @param question Question Properties
   */
  addQuestion(formId: string, question: QuestionProperties): JotformResponse {
    return this.client.postForm(`/form/${formId}/questions`, {
      question
    });
  }

  /**
   * Add new questions to specified form. Form questions might have various properties. Examples: Is it required? Are there any validations such as 'numeric only'? Detailed information: https://api.jotform.com/docs/#put-form-id-questions
   * @param formId Form ID
   * @param questions Array of Question Properties
   * Example usage:
   * ```ts
    const questions = await client.form.addQuestions(formId, [
      {
        type: 'control_email',
        name: 'emailfield',
        text: 'My email field',
        order: '1'
      }, {
        type: 'control_email',
        name: 'emailfield2',
        text: 'My email field 2',
        order: '2'
      }
    ]);
   * ```
   */
  addQuestions(formId: string, questions: QuestionProperties[]): JotformResponse {
    return this.client.put(`/form/${formId}/questions`, {
      questions
    });
  }

  /**
   * Get a form question. See: https://api.jotform.com/docs/#form-id-question-id
   * @param formId Form ID
   * @param questionId Question ID
   * @returns JotformResponse
   */
  getQuestion(formId: string, questionId: string): JotformResponse {
    return this.client.get(`/form/${formId}/question/${questionId}`);
  }

    /**
   * Edit a question property or add a new one. Form questions might have various properties. Examples: Is it required? Are there any validations such as 'numeric only'? Detailed information: https://api.jotform.com/docs/#post-form-id-question-id
   * @param formId Form ID.
   * @param questionId Question ID.
   * @param properties Question properties.
   */
  updateQuestionProperties(formId: string, questionId: string, properties: Json): JotformResponse {
    return this.client.postForm(`/form/${formId}/question/${questionId}`, {
      question: properties
    });
  }

  /**
   * Deletes the specified form's specified question.
   * @param formId Form ID
   * @param questionId Question ID
   * @returns JotformResponse
   */
  deleteQuestion(formId: string, questionId: string): JotformResponse {
    return this.client.delete(`/form/${formId}/question/${questionId}`);
  }

  /**
   * Get a list of all properties on a form. Detailed information: https://api.jotform.com/docs/#form-id-properties
   * @param formId Form ID.
   */
  getProperties(formId: string): JotformResponse {
    return this.client.get(`/form/${formId}/properties`);
  }

  /**
   * Updates properties of specified form like label width and style. See: https://api.jotform.com/docs/#post-form-id-properties
   * @param formId Form ID
   * @param properties Properties to update
   * @returns JotformResponse
   */
  updateProperties(formId: string, properties: Json): JotformResponse {
    return this.client.postForm(`/form/${formId}/properties`, {
      properties
    });
  }

  /**
   * Updates properties of specified form like label width and style. See: https://api.jotform.com/docs/#put-form-id-properties
   * @param formId Form ID
   * @param properties Properties to update
   * @returns JotformResponse
   */
  updatePropertiesJSON(formId: string, properties: Json): JotformResponse {
    return this.client.put(`/form/${formId}/properties`, {
      properties
    });
  }

  /**
   * Get a specific property of the form. Detailed information: https://api.jotform.com/docs/properties/index.php
   * @param formId Form ID.
   * @param key Property key.
   */
  getPropertyByKey(formId: string, key: string): JotformResponse {
    return this.client.get(`/form/${formId}/properties/${key}`);
  }

  /**
   * Get all the reports of a specific form.
   * @param formId Form ID.
   */
  getReports(formId: string): JotformResponse {
    return this.client.get(`/form/${formId}/reports`);
  }

  /**
   * Create new report of a form with intended fields, type and title.
   * @param formId Form ID.
   * @param reportParameters Report parameters like title type
   * Example usage:
   * ```ts
    await client.form.createReport(formId, {
      title: title,
      type: ReportType.CSV,
      fields: {
        ip: true,
        submissionDate: true,
        questionIds: ['1', '2']
      }
    });
   * ```
  */
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

  /**
   * List of files uploaded on a form. Here is how you can access a particular file: https://www.jotform.com/uploads/{username}/{form-id}/{submission-id}/{file-name}. Size and file type is also included.
   * @param formId Form ID.
   */
  getFiles(formId: string): JotformResponse {
    return this.client.get(`/form/${formId}/files`);
  }
  /**
   * Webhooks can be used to send form submission data as an instant notification. Returns list of webhooks for this form.
   * @param formId Form ID.
   */
  getWebhooks(formId: string): JotformResponse {
    return this.client.get(`/form/${formId}/webhooks`);
  }
  
  /**
   * Creates a webhook for specified form. Webhooks can be used to send form submission data as an instant notification.
   * @param formId Form ID
   * @param webhookURL Webhook URL.
   * @example http://www.myhost.com/post.php
   */
  createWebhook(formId: string, webhookURL: string): JotformResponse {
    return this.client.postForm(`/form/${formId}/webhooks`, {
      webhookURL
    });
  }

  /**
   * Delete a webhook of a specific form.
   * @param formId Form ID.
   * @param webhookId Webhook URL is where form data will be posted when form is submitted. You can get webhook IDs when you call **getWebhooks**.
   */
  deleteWebhook(formId: string, webhookId: string): JotformResponse {
    return this.client.delete(`/form/${formId}/webhooks/${webhookId}`);
  }

  /**
   * List of form reponses. Fields array has the submitted data. created_at is the date of the submission.
   * @param formId Form ID.
   * @param pagination Pagination parameters
   * @param pagination.offset Start of each result set for submission data. Useful for pagination. Default: 0.
   * @param pagination.limit Number of results in each result set for submission data. Default is 20.
   * @param pagination.filter Filters the query results to fetch a specific submissions range. Example: {"created_at:gt":"2013-01-01 00:00:00"} Example: {"formIDs":["your-form-id","your-form-id#2"]} Example: {"fullText":"John Brown"}
   * @param pagination.orderby Order results by a submission field name: id, form_id, IP, created_at, status, new, flag, updated_at.
   * @param pagination.direction ASC (ascending) or DESC (descending)
   */
  getSubmissions(formId: string, pagination: PaginationParameters): JotformResponse {
    return this.client.get(`/form/${formId}/submissions`, {
      params: {
        ...pagination
      }
    });
  }

  /**
   * Submit data to this form using the API. You should get a list of question IDs from '**getQuestions**' and send the submission data with question id. Detailed information: https://api.jotform.com/docs/#post-form-id-submissions
   * @param formId Form ID.
   * @param submissionsData Object of submissions.
   * @example
   * [
   *   {
   *      "1":{
   *         "text":"answer of Question 1"
   *      },
   *      "2":{
   *         "text":"answer of Question 2"
   *      }
   *   },
   *   {
   *      "1":{
   *         "text":"answer of Question 1"
   *      },
   *      "2":{
   *         "text":"answer of Question 2"
   *      }
   *   }
   * ]
   */
  addSubmissions(formId: string, submissionsData: Json[]): JotformResponse {
    return this.client.put(`/form/${formId}/submissions`, submissionsData);
  }

  /**
   * Adds a single submission to form
   * @param formId Form ID
   * @param submissionData Submission data
   * @returns JotformResponse
   * Example usage:
   * ```ts
    await client.form.addSubmission(form.id as string, {
      1: 'john@example.com'
    });
   * ```
   */
  addSubmission(formId: string, submissionData: Json): JotformResponse {
    return this.client.postForm(`/form/${formId}/submissions`, {
      submission: submissionData,
    });
  }

}
