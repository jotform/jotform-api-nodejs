import { ReportType } from '../lib/enums/report';
import Jotform from '../dist/index';
import { createAndAssertFormWithQuestions, sleep } from './utils';

const client = new Jotform(process.env.JF_API_KEY ?? '');

describe('User Test Suite', () => {

  beforeEach(async () => {
    await sleep(1000);
  });

  it('should get user details', async () => {
    const { content: user } = await client.user.get();
    const { status } = user;

    expect(status).toBe('ACTIVE');
  });

  it('should get usage', async () => {
    const { content: usage } = await client.user.getUsage();
    const { api } = usage;
    expect(api).toBeGreaterThan(0);
  });

  it('should get submissions', async () => {
    const { form } = await createAndAssertFormWithQuestions(client);
    const dummy = 'john@example.com';

    await client.form.addSubmission(form.id as string, {
      1: dummy
    });

    const { content: submissions } = await client.user.getSubmissions({
      limit: 1,
    });

    await client.form.delete(form.id as string);

    expect(submissions).toHaveLength(1);
  });

  it.skip('shouldn\'t get subusers', async () => {
    expect(client.user.getSubUsers()).rejects.toThrow();
  });

  it('should get user folders', async () => {
    const { content: folders } = await client.user.getFolders();
    expect(folders).toBeTruthy();
  });

  it('should get user reports', async () => {
    const { form } = await createAndAssertFormWithQuestions(client);
    const { content: report } = await client.form.createReport(form.id as string, {
      title: 'report',
      type: ReportType.CSV
    });

    const { content: userReports } = await client.user.getReports();
    const userReport = userReports[0] as Record<string, string>;
    const userReportId = userReport.id;
    expect(userReportId).toBe(report.id);
    await client.form.delete(form.id as string);
  });

  it('should get user settings', async () => {
    const { content: settings } = await client.user.getSettings();
    expect(settings.status).toBe('ACTIVE');
  });

  it('should update settings', async () => {
    await client.user.updateSettings({
      website: 'http://example.com'
    });
    const { content: settings } = await client.user.getSettings();

    expect(settings.website).toBe('http://example.com');
  });

  it.skip('should get history', async () => {
    const { content: history } = await client.user.getHistory();
    expect(history.status).toBe('ACTIVE');
  });

  it('should get forms', async () => {
    const { form } = await createAndAssertFormWithQuestions(client);
    const { content: forms } = await client.user.getForms({
      limit: 1,
    });
    expect(forms).toHaveLength(1);
    await client.form.delete(form.id as string);
  });

  it('should create form', async () => {
    const { content: form } = await client.user.createForm();
    expect(form).toHaveProperty('id');
    await client.form.delete(form.id as string);
  });

  it('should create form w/ json', async () => {
    const { content: form } = await client.user.createFormJSON({});
    expect(form).toHaveProperty('id');
    await client.form.delete(form.id as string);
  });

});
