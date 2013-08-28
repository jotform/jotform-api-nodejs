var jf = require("../JotForm")


jf.options({
    debug: true,
    apiKey: "f08b6b42e1737803390d37d7c33e80df"
});


jf.getUser()
.then(function(r){
    /* successful response after request */
    // console.log(r);
})
.fail(function(e){
    /* handle error */
});

jf.getUsage()
.then(function(r){
    /* successful response after request */
    // console.log(r);
})
.fail(function(e){
    /* handle error */
});

jf.getForms()
.then(function(r){
    /* successful response after request */
    // console.log(r);
})
.fail(function(e){
    /* handle error */
});

jf.getSubmissions({
    offset: 10,
    limit: 10,
    filter: {"updated_at:lt": "2013"},
    // orderby: "created_at",
    direction : 'ASC'
})
.then(function(r){
    /* successful response after request */
    console.log(r);
})
.fail(function(e){
    /* handle error */
});



