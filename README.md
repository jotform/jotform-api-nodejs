<p align="center">
	<img src="https://cdn.jotfor.ms/assets/resources/logo-nb/jotform-logo-transparent-400x100.png" alt="logo" height="70">
</p>
<br />

# Jotform Node.js SDK

### Installation

```sh
$ npm install jotform
```

#

### Usage

- Initialize the SDK.

```ts
import Jotform from "jotform";

const client = new Jotform('YOUR_API_KEY');
```

- Simple examples.

```ts
const response = await client.form.createForm();
const formId = response.content.id;
```

```ts
const questions = await client.form.addQuestions(formId, [
	{
		type: 'control_email',
		name: 'emailfield',
		text: 'My email field',
		order: '1'
	}, {
		type: 'control_email',
		name: 'emailfield2',
		text: 'My email field 2',
		order: '2'
	}
]);
```

- Detailed information of API: [https://api.jotform.com/docs](https://api.jotform.com/docs).
- Properties reference: [https://api.jotform.com/docs/properties/index.php](https://api.jotform.com/docs/properties/index.php)

#

### License

- This project is under the [GPLv2 license](LICENSE.md). Copyright (c) 2023 Jotform and it's contributors.
