[![npm](https://img.shields.io/npm/v/@wojtekmaj/jotform.svg)](https://www.npmjs.com/package/@wojtekmaj/jotform) ![downloads](https://img.shields.io/npm/dt/@wojtekmaj/jotform.svg) [![CI](https://github.com/wojtekmaj/jotform/workflows/CI/badge.svg)](https://github.com/wojtekmaj/jotform/actions)

# @wojtekmaj/jotform

Unofficial [Jotform API](https://api.jotform.com/docs/) Node.js Client with TypeScript support.

## tl;dr

- Install by executing `npm install @wojtekmaj/jotform` or `yarn add @wojtekmaj/jotform`.
- Import by adding `import jotform from '@wojtekmaj/jotform'`.
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

Add @wojtekmaj/jotform to your project by executing `npm install @wojtekmaj/jotform` or `yarn add @wojtekmaj/jotform`.

### Obtaining API key

To obtain Jotform API key, go to [API section](https://www.jotform.com/myaccount/api) on My Account page.

### Usage

Here's an example of basic usage:

```ts
import jotform from '@wojtekmaj/jotform';

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

## `jotform` vs `@wojtekmaj/jotform`

`@wojtekmaj/jotform` is a fork of `jotform` package. It was created to add TypeScript support, ship some long-awaited
features, add new features and fix bugs. It was rebuilt from the ground up to benefit from the latest JavaScript
features and to be more maintainable.

`@wojtekmaj/jotform` is meant to be a drop-in replacement for `jotform` package, so you can use it without any changes to your code.

Here's how the two packages compare:

| Feature                | `jotform`          | `@wojtekmaj/jotform` |
| ---------------------- | ------------------ | -------------------- |
| TypeScript support     | ❌                 | ✅                   |
| Jotform Teams support  | ❌                 | ✅                   |
| Tests                  | ❌                 | ✅                   |
| Methods available      | 36                 | 50                   |
| Number of dependencies | 2                  | 1                    |
| Bundle size            | 38.3 kB (min+gzip) | 3.5 kB (min+gzip)    |
| Install size           | 2.35 MB            | 236 kB               |

## License

GNU General Public License v2.0.

## Author

<table>
  <tr>
    <td >
      <img src="https://avatars.githubusercontent.com/u/5426427?v=4&s=128" width="64" height="64" alt="Wojciech Maj">
    </td>
    <td>
      <a href="https://github.com/wojtekmaj">Wojciech Maj</a>
    </td>
  </tr>
</table>
