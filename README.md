<p align="center">
	<img src="https://www.jotform.com/resources/assets/logo/jotform-logo-transparent-400x100.png" alt="logo" height="70">
  <br />
  <a href='https://bw3u.semaphoreci.com/badges/jotform-api-nodejs/branches/master.svg'> <img src='https://bw3u.semaphoreci.com/badges/jotform-api-nodejs/branches/master.svg' alt='Build Status'></a>
</p>
<br />

# Jotform Node.js SDK

> JotForm's Node.js SDK. 


- [x] Full TypeScript support. 
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
import JotForm from 'jotform';

const JF = new JotForm();
```

- Authenticate with JotForm.
```ts
JF.setApiKey('your-api-key');
```

- Simple examples.
```ts
JF.user
  .getUser()
  .then((response: object) => {
    console.log(response);
  })
  .catch((error) => {
    throw new Error(error);
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
    throw new Error(error);
  });
```

- Detailed information of params: [https://api.jotform.com/docs](https://api.jotform.com/docs).

#
### License

- This project is under the [GPLv3 license](LICENSE.md). Copyright (c) 2021 JotForm and it's contributors.


