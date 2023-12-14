import { ReportType } from '../lib/enums/report.ts';
import Jotform from '../lib/index.ts';
import { createAndAssertFormWithQuestions, sleep } from './utils.ts';

const client = new Jotform(process.env.JF_API_KEY ?? '');

describe('Report test suite', () => {

  beforeEach(async () => {
    await sleep(1000);
  });

  it('should get and delete report', async () => {
    const { form } = await createAndAssertFormWithQuestions(client);
    const title = 'My Report';

    const { content: report } = await client.form.createReport(form.id as string, {
      title: title,
      type: ReportType.CSV,
      fields: {
        ip: true,
        submissionDate: true,
        questionIds: ['1', '2']
      }
    });

    const { content: getReport } = await client.report.get(report.id as string);
    expect(getReport.title).toBe(title);

    await client.report.delete(getReport.id as string);
    expect(client.report.get(report.id as string)).rejects.toThrow();
    
    await client.form.delete(form.id as string);
  });

});
