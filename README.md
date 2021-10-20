<p align="center">
	<img src="https://www.jotform.com/resources/assets/logo-nb/jotform-logo-transparent-400x100.png" alt="logo" height="70">
  <br />
  <a href='https://berkcan.semaphoreci.com/badges/jotform-nodejs-sdk/branches/master.svg'> <img src='https://berkcan.semaphoreci.com/badges/jotform-nodejs-sdk/branches/master.svg' alt='Build Status'></a>
</p>
<br />

# Jotform Node.js SDK

> Jotform's Node.js SDK.

- [x] First class TypeScript support.
- [x] Promise based.

#

### Installation

```sh
$ npm install jotform
```

#

### Usage

- Initialize the SDK.

```ts
import { Jotform } from 'jotform';

const JF = new Jotform();
```

- Authenticate with Jotform.

```ts
JF.initializeSDK(
  'your-api-key',
  'Jotform Instance (US, EU or HIPAA - defaults to US)'
);
```

- Simple examples.

```ts
JF.user
  .getUser()
  .then((response: object) => {
    console.log(response);
  })
  .catch((error) => {
    console.error(error);
  });
```

```ts
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

JF.form
  .addNewQuestionToForm(formId, data)
  .then((response: object) => {
    console.log(response);
  })
  .catch((error) => {
    console.error(error);
  });
```

- Detailed information of API: [https://api.jotform.com/docs](https://api.jotform.com/docs).
- Properties reference: [https://api.jotform.com/docs/properties/index.php](https://api.jotform.com/docs/properties/index.php)

#

### License

- This project is under the [GPLv3 license](LICENSE.md). Copyright (c) 2021 Jotform and it's contributors.
