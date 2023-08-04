[![npm](https://img.shields.io/npm/v/@wojtekmaj/jotform.svg)](https://www.npmjs.com/package/@wojtekmaj/jotform) ![downloads](https://img.shields.io/npm/dt/@wojtekmaj/jotform.svg) [![CI](https://github.com/wojtekmaj/jotform/workflows/CI/badge.svg)](https://github.com/wojtekmaj/jotform/actions)

# @wojtekmaj/jotform

Unofficial [JotForm API](https://api.jotform.com/docs/) Node.js Client with TypeScript support.

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

Your project needs to use Node.js 18 or later.

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

### Usage with Jotform Teams

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

`@wojtekmaj/jotform` meant to be a drop-in replacement for `jotform` package, so you can use it without any changes to your code.

Here's how the two packages compare:

| Feature                | `jotform`          | `@wojtekmaj/jotform` |
| ---------------------- | ------------------ | -------------------- |
| TypeScript support     | ❌                 | ✅                   |
| Jotform Teams support  | ❌                 | ✅                   |
| Tests                  | ❌                 | ✅                   |
| Methods available      | 36                 | 48                   |
| Number of dependencies | 2                  | 1                    |
| Bundle size            | 38.3 kB (min+gzip) | 3.2 kB (min+gzip)    |
| Install size           | 2.35 MB            | 134 kB               |

## License

GNU General Public License v2.0.

## Author

<table>
  <tr>
    <td>
      <img src="https://github.com/wojtekmaj.png?s=100" width="100">
    </td>
    <td>
      Wojciech Maj<br />
      <a href="mailto:kontakt@wojtekmaj.pl">kontakt@wojtekmaj.pl</a><br />
      <a href="https://wojtekmaj.pl">https://wojtekmaj.pl</a>
    </td>
  </tr>
</table>
