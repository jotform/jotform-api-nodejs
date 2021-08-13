import { JotForm } from '../src/index';
import 'dotenv/config';

const JF = new JotForm();

beforeAll(() => {
  JF.setApiKey(process.env.JF_APIKEY as string);
});

describe('Folder tests', () => {
  it('Get folder details', () => {
    JF.folder
      .getFolder('60eb9c87ebbbfe0bdf2b0fd1')
      .then((response: any) => {
        expect(response.responseCode).toEqual(200);
        expect(Object.keys(response.content).length).toBeGreaterThan(1);
      })
      .catch((error) => {
        console.error(error);
        throw new Error(error);
      });
  });
});
