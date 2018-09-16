var assert = require("chai").assert;
var nock = require("nock");

var jf = require("../");

before(function(){
	jf.options({
		debug: true,
		apiKey: "f08b6b42e1737803390d37d7c33e80df"
	});
});

describe("getUser", function(){
	before(function(){
		nock("http://api.jotform.com")
			.get("/user")
			.query({ apiKey: "f08b6b42e1737803390d37d7c33e80df" })
			.reply(200, { responseCode: "200", "content": "ok" });
	});
	it("gets user", function(){
		return jf.getUser().then(function(r){
			assert.equal(r, "ok");
		});
	});
});

describe("getUsage", function(){
	before(function(){
		nock("http://api.jotform.com")
			.get("/user/usage")
			.query({ apiKey: "f08b6b42e1737803390d37d7c33e80df" })
			.reply(200, { responseCode: "200", "content": "ok" });
	});
	it("gets usage", function(){
		return jf.getUsage().then(function(r){
			assert.equal(r, "ok");
		});
	});
});

describe("getForms", function(){
	before(function(){
		nock("http://api.jotform.com")
			.get("/user/forms")
			.query({ apiKey: "f08b6b42e1737803390d37d7c33e80df" })
			.reply(200, { responseCode: "200", "content": "ok" });
	});
	it("gets usage", function(){
		return jf.getForms().then(function(r){
			assert.equal(r, "ok");
		});
	});
});
