[![npm](https://img.shields.io/npm/v/jotform.svg)](https://www.npmjs.com/package/jotform) ![downloads](https://img.shields.io/npm/dt/jotform.svg) [![CI](https://github.com/jotform/jotform-api-nodejs/workflows/CI/badge.svg)](https://github.com/jotform/jotform-api-nodejs/actions)

# jotform

[Jotform API](https://api.jotform.com/docs/) Node.js Client with TypeScript support.

## tl;dr

- Install by executing `npm install jotform` or `yarn add jotform`.
- Import by adding `import jotform from 'jotform'`.
- Authenticate:
  ```ts
  jotform.options({
    apiKey: 'YOUR_API_KEY',
  });
  ```
- Do stuff with it!
  ```ts
  const user = await jotform.getUser();
  ```

## Getting started

### Compatibility

Your project needs to use Node.js 18.0.0 or later.

You may be able to use it with Node.js 17.5.0, provided that you use `--experimental-global-fetch` flag.

### Installation

Add `jotform` to your project by executing `npm install jotform` or `yarn add jotform`.

### Obtaining API key

To obtain Jotform API key, go to [API section](https://www.jotform.com/myaccount/api) on My Account page.

### Usage

Here's an example of basic usage:

```ts
import jotform from 'jotform';

jotform.options({
  apiKey: 'YOUR_API_KEY',
});

const user = await jotform.getUser();
```

#### Usage with EU Safe mode

If you're using Jotform EU Safe mode, you need to specify `url` option:

```ts
jotform.options({
  url: 'https://eu-api.jotform.com',
});
```

#### Usage with HIPAA Compliance mode

If you're using Jotform HIPAA Compliance mode, you need to specify `url` option:

```ts
jotform.options({
  url: 'https://hipaa-api.jotform.com',
});
```

#### Usage with Jotform Enterprise

If you're using Jotform Enterprise, you will need to specify `url` option:

```ts
jotform.options({
  url: 'https://your-domain.com/API',
});
```

or:

```ts
jotform.options({
  url: 'https://your-subdomain.jotform.com/API',
});
```

#### Usage with Jotform Teams

To access resources located in a Jotform Team, a custom `jf-team-id` header needs to be added to each request. It can be done by passing `customHeaders` object to desired method:

```ts
const teamForm = await jotform.getForm('FORM_ID', { 'jf-team-id': 'YOUR_TEAM_ID' });
```

## API Documentation

Jotform API documentation is available at https://api.jotform.com/docs/.

## License

GNU General Public License v2.0.
