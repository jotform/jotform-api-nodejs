import { IClient } from '../client';

interface IForm {
  getForm(formId: string): Promise<object>;
  getFormQuestions(formId: string): Promise<object>;
  getFormSubmissions(
    formId: string,
    offset?: number,
    limit?: number,
    filter?: object,
    orderby?: string,
    direction?: string,
    nocache?: string
  ): Promise<object>;
  getFormProperties(formId: string): Promise<object>;
  getFormPropertyByKey(formId: string, key: string): Promise<object>;
  getFormReports(formId: string): Promise<object>;
  getFormFiles(formId: string): Promise<object>;
  getFormWebhooks(formId: string): Promise<object>;
  createFormSubmissions(formId: string, data: object): Promise<object>;
  createFormWebhook(formId: string, webhookURL: string): Promise<object>;
  createForms(data: object): Promise<object>;
  addNewQuestionToForm(formId: string, data: object): Promise<object>;
  addOrEditQuestionProperty(
    formId: string,
    questionId: string,
    data: object
  ): Promise<object>;
  createFormReport(
    formId: string,
    title: string,
    list_type: string,
    fields?: string
  ): Promise<object>;
  createOrEditFormProperty(formId: string, data: object): Promise<object>;
  deleteForm(formId: string): Promise<object>;
  deleteFormQuestion(formId: string, questionId: string): Promise<object>;
  deleteFormWebhook(formId: string, webhookId: string): Promise<object>;
}

export class Form implements IForm {
  private client: IClient;

  constructor(client: IClient) {
    this.client = client;
  }

  /**
   * Get basic information about a form.
   * @param formId Forms ID.
   */
  getForm = (formId: string): Promise<object> => {
    return this.client.Request('GET', `/form/${formId}`);
  };

  /**
   * Get a list of all questions on a form. Type describes question field type. Order is the question order in the form. Text field is the question label.
   * @param formId Forms ID.
   */
  getFormQuestions = (formId: string): Promise<object> => {
    return this.client.Request('GET', `/form/${formId}/questions`);
  };

  /**
   * List of form reponses. Fields array has the submitted data. Created_at is the date of the submission.
   * @param formId Forms ID.
   * @param offset Start of each result set for submission data. Useful for pagination. Default: 0.
   * @param limit Number of results in each result set for submission data. Default is 20.
   * @param filter Filters the query results to fetch a specific submissions range. Example: {"created_at:gt":"2013-01-01 00:00:00"} Example: {"formIDs":["your-form-id","your-form-id#2"]} Example: {"fullText":"John Brown"}
   * @param orderby Order results by a submission field name: id, form_id, IP, created_at, status, new, flag, updated_at.
   * @param direction ASC (ascending) or DESC (descending)
   * @param nocache No cache. True | False.
   */
  getFormSubmissions = (
    formId: string,
    offset?: number,
    limit?: number,
    filter?: object,
    orderby?: string,
    direction?: string,
    nocache?: string
  ): Promise<object> => {
    return this.client.Request(
      'GET',
      `/form/${formId}/submissions?filter=${filter || ''}&offset=${
        offset || ''
      }&limit${limit || ''}&orderby=${orderby || ''}&nocache=${
        nocache || ''
      }&direction=${direction || ''}`
    );
  };

  /**
   * Get a list of all properties on a form. Detailed information: https://api.jotform.com/docs/properties/index.php
   * @param formId Form ID.
   */
  getFormProperties = (formId: string): Promise<object> => {
    return this.client.Request('GET', `/form/${formId}/properties`);
  };

  /**
   * Get a specific property of the form. Detailed information: https://api.jotform.com/docs/properties/index.php
   * @param formId Form ID.
   * @param key Property key.
   */
  getFormPropertyByKey = (formId: string, key: string): Promise<object> => {
    return this.client.Request('GET', `/form/${formId}/properties/${key}`);
  };

  /**
   * Get all the reports of a specific form.
   * @param formId Form ID.
   */
  getFormReports = (formId: string): Promise<object> => {
    return this.client.Request('GET', `/form/${formId}/reports`);
  };

  /**
   * List of files uploaded on a form. Here is how you can access a particular file: https://www.jotform.com/uploads/{username}/{form-id}/{submission-id}/{file-name}. Size and file type is also included.
   * @param formId Form ID.
   */
  getFormFiles = (formId: string): Promise<object> => {
    return this.client.Request('GET', `/form/${formId}/files`);
  };

  /**
   * Webhooks can be used to send form submission data as an instant notification. Returns list of webhooks for this form.
   * @param formId Form ID.
   */
  getFormWebhooks = (formId: string): Promise<object> => {
    return this.client.Request('GET', `/form/${formId}/webhooks`);
  };

  /**
   * Submit data to this form using the API. You should get a list of question IDs from '**getFormQuestions**' and send the submission data with question id. Detailed information: https://api.jotform.com/docs/#post-form-id-submissions
   * @param formId Forms ID.
   * @param data Object of submissions.
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
  createFormSubmissions = (formId: string, data: object): Promise<object> => {
    return this.client.Request('PUT', `/form/${formId}/submissions`, data);
  };

  /**
   * Creates a webhook for specified form. Webhooks can be used to send form submission data as an instant notification.
   * @param formId Form ID
   * @param webhookURL Webhook URL.
   * @example http://www.myhost.com/post.php
   */
  createFormWebhook = (formId: string, webhookURL: string): Promise<object> => {
    const params = new URLSearchParams({ webhookURL: webhookURL });

    return this.client.Request('POST', `/form/${formId}/webhooks`, params);
  };

  /**
   * Add new forms with questions, properties and email settings. Detailed information: https://api.jotform.com/docs/#put-forms
   * @param data Form data.
   * @example
   * {
   *   "questions":[
   *      {
   *         "type":"control_head",
   *         "text":"Form Title",
   *         "order":"1",
   *         "name":"Header"
   *      },
   *      {
   *         "type":"control_textbox",
   *         "text":"Text Box Title",
   *         "order":"2",
   *         "name":"TextBox",
   *         "validation":"None",
   *         "required":"No",
   *         "readonly":"No",
   *         "size":"20",
   *         "labelAlign":"Auto",
   *        "hint":""
   *      }
   *   ],
   *   "properties":{
   *      "title":"New Form",
   *      "height":"600"
   *   },
   *   "emails":[
   *      {
   *         "type":"notification",
   *         "name":"notification",
   *         "from":"default",
   *         "to":"noreply@jotform.com",
   *         "subject":"New Submission",
   *         "html":"false"
   *      }
   *   ]
   * }
   */
  createForms = (data: object): Promise<object> => {
    return this.client.Request('PUT', '/form', data);
  };

  /**
   * Add new questions to specified form. Form questions might have various properties. Examples: Is it required? Are there any validations such as 'numeric only'? Detailed information: https://api.jotform.com/docs/#put-form-id-questions
   * @param formId Form ID
   * @param data Question
   * @example
   * {
   *   "questions":{
   *      "1":{
   *         "type":"control_head",
   *         "text":"Text 1",
   *         "order":"1",
   *         "name":"Header1"
   *      },
   *      "2":{
   *         "type":"control_head",
   *         "text":"Text 2",
   *         "order":"2",
   *         "name":"Header2"
   *      }
   *   }
   * }
   */
  addNewQuestionToForm = (formId: string, data: object): Promise<object> => {
    return this.client.Request('PUT', `/form/${formId}/questions`, data);
  };

  /**
   * Edit a question property or add a new one. Form questions might have various properties. Examples: Is it required? Are there any validations such as 'numeric only'? Detailed information: https://api.jotform.com/docs/#post-form-id-question-id
   * @param formId Form ID.
   * @param questionId Question ID.
   * @param data Question properties.
   */
  addOrEditQuestionProperty = (
    formId: string,
    questionId: string,
    data: object
  ): Promise<object> => {
    return this.client.Request(
      'POST',
      `/form/${formId}/question/${questionId}`,
      data
    );
  };

  /**
   * Create new report of a form with intended fields, type and title.
   * @param formId Form ID.
   * @param title Report title.
   * @param list_type Report type. Must be one of the following: | **csv** | **excel** | **grid** | **table** | **rss** |
   * @param fields Report fields. You can pass empty string if you don't need it. You can insert multiple, example: "dt, ip". | **ip** | **dt** (submission date) | **qid** (question id) |
   */
  createFormReport = (
    formId: string,
    title: string,
    list_type: string,
    fields: string
  ): Promise<object> => {
    const params = new URLSearchParams({
      formId: formId,
      title: title,
      list_type: list_type,
      fields: fields,
    });

    return this.client.Request('POST', `/form/${formId}/reports`, params);
  };

  /**
   *
   * @param formId Form ID.
   * @param data Property data.
   * @example
   * {
   *   "properties":{
   *      "activeRedirect":"default",
   *      "formWidth":"650",
   *      "labelWidth":"150",
   *      "styles":"nova"
   *   }
   * }
   */
  createOrEditFormProperty = (
    formId: string,
    data: object
  ): Promise<object> => {
    return this.client.Request('PUT', `/form/${formId}/properties`, data);
  };

  /**
   * Delete an existing form.
   * @param formId Form ID.
   */
  deleteForm = (formId: string): Promise<object> => {
    return this.client.Request('DELETE', `/form/${formId}`);
  };

  /**
   * Delete a single form question.
   * @param formId Form ID.
   * @param questionId Question ID.
   */
  deleteFormQuestion = (
    formId: string,
    questionId: string
  ): Promise<object> => {
    return this.client.Request(
      'DELETE',
      `/form/${formId}/question/${questionId}`
    );
  };

  /**
   * Delete a webhook of a specific form.
   * @param formId Form ID.
   * @param webhookId Webhook URL is where form data will be posted when form is submitted. You can get webhook IDs when you call **getFormWebhooks**.
   */
  deleteFormWebhook = (formId: string, webhookId: string): Promise<object> => {
    return this.client.Request(
      'DELETE',
      `/form/${formId}/webhooks/${webhookId}`
    );
  };
}
