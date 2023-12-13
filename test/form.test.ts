import { ReportType } from '../lib/enums/report.ts';
import Jotform from '../lib/index.ts';
import { createAndAssertForm, createAndAssertFormWithQuestions, sleep } from './utils.ts';

const client = new Jotform(process.env.JF_API_KEY ?? '');

describe('Form Test Suite', () => {

  beforeEach(async () => {
    await sleep(1000);
  });

  it('should create and delete empty form', async () => {
    const formId = (await createAndAssertForm(client)).id;
    const deleteResponse = await client.form.delete(formId as string);
    expect(deleteResponse.responseCode).toBe(200);
  });

  it('should create a form with questions then update it', async () => {
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
    expect(response.responseCode).toBe(200);
    const formId = response.content.id;
    expect(formId).toBeTruthy();
    const questionsResponse = await client.form.getQuestions(`${formId}`);
    expect(questionsResponse.responseCode).toBe(200);
    const questions = questionsResponse.content;
    
    const emailField = questions?.['1'] as Record<string, unknown>;
    expect(emailField?.['type']).toBe('control_email');

    const updateResponse = await client.form.updateQuestionProperties(formId as string, '1', {
      name: 'my_email_field'
    });
    expect(updateResponse.responseCode).toBe(200);
    const [updatedProperties] = updateResponse.content as unknown as Record<string, string>[];
    expect(updatedProperties.name).toBe('my_email_field');
    await client.form.delete(formId as string);
  });

  it('should get form by id', async () => {
    const formId = (await createAndAssertForm(client)).id;

    const formResponse = await client.form.get(formId as string);
    const formResponseId = formResponse.content.id;
    expect(formResponseId).toBe(formId);

    const deleteResponse = await client.form.delete(formId as string);
    expect(deleteResponse.responseCode).toBe(200);
  });

  it('should clone provided form', async () => {
    const content = await createAndAssertForm(client);
    const { id: formId, username, height } = content;

    const cloned = (await client.form.clone(formId as string)).content;
    const clonedId = cloned.id;
    expect(clonedId).toBeTruthy();

    expect(cloned.username).toBe(username);
    expect(cloned.height).toBe(height);

    await client.form.delete(formId as string);
    await client.form.delete(clonedId as string);
  });

  it('should add question to form', async () => {
    const formId = (await createAndAssertForm(client)).id as string;
    const question = await client.form.addQuestion(formId, {
      type: 'control_email',
      name: 'emailfield',
      text: 'My email field',
      order: '1'
    });
    const { content } = question;
    const { qid } = content;
    expect(qid).toBe(1);

    await client.form.delete(formId as string);
  });

  it('should add questions to form', async () => {
    const { form } = await createAndAssertFormWithQuestions(client);
    await client.form.delete(form.id as string);
  });
  
  it('should add questions to form then update question property', async () => {
    const { form } = await createAndAssertFormWithQuestions(client);
    const updateResponse = await client.form.updateQuestionProperties(form.id as string, '1', {
      name: 'my_email_field'
    });
    expect(updateResponse.responseCode).toBe(200);
    const [updatedProperties] = updateResponse.content as unknown as Record<string, string>[];
    expect(updatedProperties.name).toBe('my_email_field');
    
    await client.form.delete(form.id as string);
  });

  it('should delete question properly', async () => {
    const { form, questions } = await createAndAssertFormWithQuestions(client);

    const [q1] = questions as unknown as Record<string, unknown>[];
    const qid1 = q1.qid;

    await client.form.deleteQuestion(form.id as string, `${qid1}`);

    const changedQuestionsResp = await client.form.getQuestions(form.id as string);
    const changedQuestionsObj = changedQuestionsResp.content;
    const changedQuestions = Object.values(changedQuestionsObj);
    expect(changedQuestions.length).toBe(1);

    await client.form.delete(form.id as string);
  });

  it('should update form properties', async () => {
    const formId = (await createAndAssertForm(client)).id;

    await client.form.updateProperties(formId as string, {
      highlightLine: 'Enabled'
    });

    const propertiesResp = await client.form.getProperties(formId as string);
    const properties = propertiesResp.content;

    expect(properties.highlightLine).toBe('Enabled');

    const deleteResponse = await client.form.delete(formId as string);
    expect(deleteResponse.responseCode).toBe(200);
  });

  it('should create and get reports', async () => {
    const { form } = await createAndAssertFormWithQuestions(client);
    const title = 'My Report';

    await client.form.createReport(form.id as string, {
      title: title,
      type: ReportType.CSV,
      fields: {
        ip: true,
        submissionDate: true,
        questionIds: ['1', '2']
      }
    });

    const reportsResp = await client.form.getReports(form.id as string);
    const reports = reportsResp.content;

    const report = reports[0] as Record<string, string>;

    expect(report.form_id).toBe(form.id);
    expect(report.title).toBe(title);
    expect(report.list_type).toBe(ReportType.CSV);
    expect(report.fields).toBe('ip,dt,1,2');

    await client.form.delete(form.id as string);
  });

  it('should create submission properly', async () => {
    const { form } = await createAndAssertFormWithQuestions(client);
    const dummy = 'john@example.com';

    await client.form.addSubmission(form.id as string, {
      1: dummy
    });

    const submission = await client.form.getSubmissions(form.id as string, {
      limit: 1,
    });

    const { answers: ans } = (submission.content[0] as Record<string, unknown>);
    const answers = ans as Record<string, Record<string, unknown>>;
    const q1 = answers?.['1'];
    const q2 = answers?.['2'];
    expect(q1.answer).toBe(dummy);
    expect(q2?.answer).toBeUndefined();

    await client.form.delete(form.id as string);
  });

  it('should create submissions properly', async () => {
    const { form } = await createAndAssertFormWithQuestions(client);
    const dummy = 'john@example.com';

    const submissionCount = 5;

    const submissionsData = Array.from(Array(submissionCount).keys()).map(() => ({
      1: dummy
    }));

    await client.form.addSubmissions(form.id as string, submissionsData);

    const submissions = await client.form.getSubmissions(form.id as string, {
      limit: submissionCount,
    });
    
    (submissions.content as unknown as Record<string, unknown>[]).forEach(sub => {
      const { answers: ans } = (sub as Record<string, unknown>);
      const answers = ans as Record<string, Record<string, unknown>>;
      const q1 = answers?.['1'];
      const q2 = answers?.['2'];
      expect(q1.answer).toBe(dummy);
      expect(q2?.answer).toBeUndefined();
    });

    await client.form.delete(form.id as string);
  });
});
