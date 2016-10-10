jotform-api-nodejs 
===============
[JotForm API](http://api.jotform.com/docs/) - NodeJS Client

### Installation

```sh
$ npm install jotform
```

### Documentation

You can find the docs for the API of this client at [http://api.jotform.com/docs/](http://api.jotform.com/docs)

### Authentication

JotForm API requires API key for all user related calls. You can create your API Keys at  [API section](http://www.jotform.com/myaccount/api) of My Account page.

### Examples

```javascript
var jotform = require("jotform")

jotform.options({
	debug: true,
	apiKey: "YOUR_API_KEY"
});

jotform.getUser()
.then(function(r){
	/* successful response after request */
})
.fail(function(e){
	/* handle error */
}
```

See [Documentation](http://api.jotform.com) for full list of methods available.

