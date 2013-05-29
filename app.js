var jf = require("./jotform-api");

jf.options({
	debug: true,
	apiKey: "08311b2b434dbe05e5443784eb5852c5"
});

jf.getUserSubmissionById()
.then(function(r){
	console.log("dsfdsf", r);
})
.fail(function(e){
	console.log("falia", e)
});





