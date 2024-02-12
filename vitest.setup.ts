import jotform from './src/index.js';

const JOTFORM_API_KEY = process.env.JOTFORM_API_KEY;

if (!JOTFORM_API_KEY) {
  throw new Error('JOTFORM_API_KEY is undefined');
}

jotform.options({
  apiKey: JOTFORM_API_KEY,
  debug: true,
});
