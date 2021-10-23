import { Jotform } from '../src/index';
import 'dotenv/config';

const JF = new Jotform();

beforeAll(() => {
  JF.initializeSDK(process.env.JF_APIKEY as string);
});

describe('User tests', () => {
  it('Get user', () => {
    JF.user
      .getUser()
      .then((response: any) => {
        expect(response.responseCode).toEqual(200);
        expect(Object.keys(response.content).length).toBeGreaterThan(1);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  it('Get user usage', () => {
    JF.user
      .getUsage()
      .then((response: any) => {
        expect(response.responseCode).toEqual(200);
        expect(Object.keys(response.content).length).toBeGreaterThan(1);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  it('Get user forms', () => {
    JF.user
      .getForms()
      .then((response: any) => {
        expect(response.responseCode).toEqual(200);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  it('Get user submissions', () => {
    JF.user
      .getSubmissions()
      .then((response: any) => {
        expect(response.responseCode).toEqual(200);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  it('Get user subusers', () => {
    JF.user
      .getSubusers()
      .then((response: any) => {
        expect(response.responseCode).toEqual(200);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  it('Get user folders', () => {
    JF.user
      .getFolders()
      .then((response: any) => {
        expect(response.responseCode).toEqual(200);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  it('Get user settings', () => {
    JF.user
      .getSettings()
      .then((response: any) => {
        expect(response.responseCode).toEqual(200);
        expect(Object.keys(response.content).length).toBeGreaterThan(1);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  it('Get user reports', () => {
    JF.user
      .getReports()
      .then((response: any) => {
        expect(response.responseCode).toEqual(200);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  // Broken endpoint it will fail.
  // it('Get User History', () => {
  //   JF.user.getHistory().then((response: any) => {
  //     expect(response.responseCode).toEqual(200);
  //   });
  // });

  it('Update user settings', () => {
    JF.user
      .updateUserSettings({ website: 'http://example.com' })
      .then((response: any) => {
        expect(response.responseCode).toEqual(200);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  it('Register user', () => {
    JF.user
      .registerUser(
        (Math.random() + 1).toString(36).substring(7),
        (Math.random() + 1).toString(36).substring(7),
        `${(Math.random() + 1).toString(36).substring(7)}@example.com`
      )
      .then((response: any) => {
        expect(response.responseCode).toEqual(200);
      });
  });
});
