import JotForm from '../src/index';
import 'dotenv/config';

const JF = new JotForm();
let reportId: string;
let formId: string;

beforeAll(() => {
  JF.setApiKey(process.env.JF_APIKEY);
});

describe('Report tests', () => {
  beforeAll(async () => {
    const data = {
      questions: [
        {
          type: 'control_head',
          text: 'Form Title',
          order: '1',
          name: 'Header',
        },
        {
          type: 'control_textbox',
          text: 'Text Box Title',
          order: '2',
          name: 'TextBox',
          validation: 'None',
          required: 'No',
          readonly: 'No',
          size: '20',
          labelAlign: 'Auto',
          hint: '',
        },
      ],
      properties: {
        title: 'New Form',
        height: '600',
      },
      emails: [
        {
          type: 'notification',
          name: 'notification',
          from: 'default',
          to: 'noreply@jotform.com',
          subject: 'New Submission',
          html: 'false',
        },
      ],
    };

    await JF.form
      .createForms(data)
      .then((response: any) => {
        formId = response.content.id; // To create a report.
      })
      .catch((error) => {
        console.error(error);
        throw new Error(error);
      });

    await JF.form
      .createFormReport(formId, 'Test report', 'csv', '')
      .then((response: any) => {
        reportId = response.content.id;
      });
  });

  afterAll(() => {
    JF.form.deleteForm(formId);
  });

  it('Get report details', async () => {
    await JF.report
      .getReport(reportId)
      .then((response: any) => {
        expect(response.responseCode).toEqual(200);
        expect(response.content.id).toEqual(reportId);
      })
      .catch((error) => {
        console.error(error);
        throw new Error(error);
      });
  });

  it('Delete the report', () => {
    JF.report.deleteReport(reportId).then((response: any) => {
      expect(response.responseCode).toEqual(200);
    });
  });
});
