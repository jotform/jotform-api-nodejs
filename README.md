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

## API Documentation

Jotform API documentation is available at https://api.jotform.com/docs/.

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
