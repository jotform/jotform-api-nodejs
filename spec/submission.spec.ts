import { Jotform } from '../src/index';
import 'dotenv/config';

const JF = new Jotform();
let submissionId: string;
let formId: string;

beforeAll(() => {
  JF.initializeSDK(process.env.JF_APIKEY as string);
});

describe('Submission tests', () => {
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
        formId = response.content.id; // To create a submission.
        expect(response.responseCode).toEqual(200);
      })
      .catch((error) => {
        console.error(error);
      });

    const questions = {
      questions: {
        '1': {
          type: 'control_head',
          text: 'Text 1',
          order: '1',
          name: 'Header1',
        },
        '2': {
          type: 'control_head',
          text: 'Text 2',
          order: '2',
          name: 'Header2',
        },
      },
    };

    await JF.form
      .addNewQuestionToForm(formId, questions) // Create questions.
      .then((response: any) => {
        expect(response.responseCode).toEqual(200);
      })
      .catch((error) => {
        console.error(error);
      });

    const submission = [
      {
        '1': {
          text: 'answer of Question 1',
        },
        '2': {
          text: 'answer of Question 2',
        },
      },
      {
        '1': {
          text: 'answer of Question 1',
        },
        '2': {
          text: 'answer of Question 2',
        },
      },
    ];

    await JF.form
      .createFormSubmissions(formId, submission)
      .then((response: any) => {
        submissionId = response.content[0].submissionID; // To run the submission tests.
        expect(response.responseCode).toEqual(200);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  afterAll(() => {
    JF.form.deleteForm(formId);
  });

  it('Get submission details', async () => {
    await JF.submission
      .getSubmission(submissionId)
      .then((response: any) => {
        expect(response.responseCode).toEqual(200);
        expect(response.content.id).toEqual(submissionId);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  it('Edit submission details', async () => {
    const data = {
      'submission[]': '',
    };

    await JF.submission
      .editSubmission(submissionId, data)
      .then((response: any) => {
        expect(response.responseCode).toEqual(200);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  it('Delete submission', () => {
    JF.submission
      .deleteSubmission(submissionId)
      .then((response: any) => {
        expect(response.responseCode).toEqual(200);
      })
      .catch((error) => {
        console.error(error);
      });
  });
});
