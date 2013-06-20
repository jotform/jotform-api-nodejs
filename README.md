jotform-api-nodejs
==================

##What's this?

A Client for Jotform API written for NodeJS
It was developed with promise pattern according to [CommonJS Promise Interface](http://wiki.commonjs.org/wiki/Promises) using [Request](https://github.com/mikeal/request) and [Q](https://github.com/kriskowal/q)

##Example

var jotform = require("jotform-api-nodejs")

jf.options({
	debug: true,
	apiKey: "YOUR_API_KEY"
});

jf.getUser()
.then(function(r){
	/* successful response after request */
})
.fail(function(e){
	/* handle error */
}

See [Documentation](http://api.jotform.com) for full list of methods available

