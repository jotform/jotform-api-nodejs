var jf = require("./jotform");

jf.options({
	debug: true,
	apiKey: "f08b6b42e1737803390d37d7c33e80df"
});

jf.getUser()
.then(function(r){
	console.log("dsfdsf", r);
})
.fail(function(e){
	console.log("falia", e)
});





