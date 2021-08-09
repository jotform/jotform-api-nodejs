import JotForm from '../src/index';
import 'dotenv/config';

const JF = new JotForm();

beforeAll(() => {
  JF.setApiKey(process.env.JF_APIKEY);
});

describe('System tests', () => {
  it('Get plan details', () => {
    JF.system
      .getPlans('FREE')
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
