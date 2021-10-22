import { Jotform } from '../src/index';
import 'dotenv/config';

const JF = new Jotform();
let formId: string;

beforeAll(() => {
  JF.initializeSDK(process.env.JF_APIKEY as string);
});

describe('Form tests', () => {
  describe('Create form tests', () => {
    it('Create form', async () => {
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
          formId = response.content.id; // To use with other tests.

          expect(response.responseCode).toEqual(200);
          expect(Object.keys(response.content).length).toBeGreaterThan(1);
        })
        .catch((error) => {
          console.error(error);
        });
    });

    it('Create/Edit question property', async () => {
      const data = {
        'question[name]': 'Edited',
      };

      await JF.form
        .addOrEditQuestionProperty(formId, '1', data)
        .then((response: any) => {
          expect(response.responseCode).toEqual(200);
        })
        .catch((error) => {
          console.error(error);
        });
    });

    it('Add new question to form', async () => {
      const data = {
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
        .addNewQuestionToForm(formId, data)
        .then((response: any) => {
          expect(response.responseCode).toEqual(200);
        })
        .catch((error) => {
          console.error(error);
        });
    });

    it('Create form report', async () => {
      await JF.form
        .createFormReport(formId, 'Test report', 'csv', '')
        .then((response: any) => {
          expect(response.responseCode).toEqual(200);
        })
        .catch((error) => {
          console.error(error);
        });
    });

    it('Create/Edit form property', async () => {
      const data = {
        properties: {
          activeRedirect: 'default',
          formWidth: '650',
          labelWidth: '150',
          styles: 'nova',
        },
      };

      await JF.form
        .createOrEditFormProperty(formId, data)
        .then((response: any) => {
          expect(response.responseCode).toEqual(200);
        })
        .catch((error) => {
          console.error(error);
        });
    });

    it('Create a form submission', async () => {
      const data = [
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
        .createFormSubmissions(formId, data)
        .then((response: any) => {
          expect(response.responseCode).toEqual(200);
        })
        .catch((error) => {
          console.error(error);
        });
    });

    it('Create a form webhook', async () => {
      await JF.form
        .createFormWebhook(formId, 'http://www.example.com/post.php')
        .then((response: any) => {
          expect(response.responseCode).toEqual(200);
        })
        .catch((error) => {
          console.error(error);
        });
    });

    it('Clone a single form', async () => {
      await JF.form
        .cloneForm(formId)
        .then((response: any) => {
          expect(response.responseCode).toEqual(200);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  });

  describe('Get form tests', () => {
    it('Get form', () => {
      JF.form
        .getForm(formId)
        .then((response: any) => {
          expect(response.responseCode).toEqual(200);
          expect(Object.keys(response.content).length).toBeGreaterThan(1);
        })
        .catch((error) => {
          console.error(error);
        });
    });

    it('Get form questions', () => {
      JF.form
        .getFormQuestions(formId)
        .then((response: any) => {
          expect(response.responseCode).toEqual(200);
        })
        .catch((error) => {
          console.error(error);
        });
    });

    it('Get form submissions', () => {
      JF.form
        .getFormSubmissions(formId)
        .then((response: any) => {
          expect(response.responseCode).toEqual(200);
        })
        .catch((error) => {
          console.error(error);
        });
    });

    it('Get form properties', () => {
      JF.form
        .getFormProperties(formId)
        .then((response: any) => {
          expect(response.responseCode).toEqual(200);
        })
        .catch((error) => {
          console.error(error);
        });
    });

    it('Get specific property with key', () => {
      JF.form
        .getFormPropertyByKey(formId, 'formWidth')
        .then((response: any) => {
          expect(response.responseCode).toEqual(200);
        })
        .catch((error) => {
          console.error(error);
        });
    });

    it('Get form reports', () => {
      JF.form
        .getFormReports(formId)
        .then((response: any) => {
          expect(response.responseCode).toEqual(200);
        })
        .catch((error) => {
          console.error(error);
        });
    });

    it('Get form webhooks', () => {
      JF.form
        .getFormWebhooks(formId)
        .then((response: any) => {
          expect(response.responseCode).toEqual(200);
        })
        .catch((error) => {
          console.error(error);
        });
    });

    it('Get form files', () => {
      JF.form
        .getFormFiles(formId)
        .then((response: any) => {
          expect(response.responseCode).toEqual(200);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  });

  describe('Delete form tests', () => {
    it('Delete form question', () => {
      JF.form
        .deleteFormQuestion(formId, '1')
        .then((response: any) => {
          expect(response.responseCode).toEqual(200);
        })
        .catch((error) => {
          console.error(error);
        });
    });

    it('Delete form webhook', () => {
      JF.form
        .deleteFormWebhook(formId, '0')
        .then((response: any) => {
          expect(response.responseCode).toEqual(200);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  });

  it('Delete form', () => {
    JF.form
      .deleteForm(formId)
      .then((response: any) => {
        expect(response.responseCode).toEqual(200);
      })
      .catch((error) => {
        console.error(error);
      });
  });
});
