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
    orderby: "created_at",
    direction : 'ASC'
})
.then(function(r){
    /* successful response after request */
})
.fail(function(e){
    /* handle error */
});

jf.getSubusers()
.then(function(r){
    // console.log(r);
})
.fail(function(e){
    /* handle error */
});

jf.getFolders()
.then(function(r){
    // console.log(r);
})
.fail(function(e){
    /* handle error */
});

jf.getReports()
.then(function(r){
    // console.log(r);
})
.fail(function(e){
    /* handle error */
});

jf.getSettings()
.then(function(r){
    // console.log(r);
})
.fail(function(e){
    /* handle error */
});

jf.getHistory({
    action : 'formCreation',
    date:'lastWeek',
    sortBy : 'DESC',
    startDate : '20/08/2013',
    endDate : '27/08/2013'
})
.then(function(r){
    // console.log(r);
})
.fail(function(e){
    /* handle error */
});

jf.getForm('30804287175961')
.then(function(r){
    // console.log(r);
})
.fail(function(e){
    /* handle error */
});

jf.getFormQuestions('30804287175961')
.then(function(r){
    // console.log(r);
})
.fail(function(e){
    /* handle error */
});

jf.getFormSubmissions('30804287175961', {
    offset: 10,
    limit: 10,
    filter: {"updated_at:lt": "2013"},
    orderby: "created_at",
    direction : 'ASC'
})
.then(function(r){
    // console.log(r);
})
.fail(function(e){
    /* handle error */
});

jf.createFormSubmission('32393265075860', 
    {
        "submission[1]": "answer of Question 444",
        "submission[2]": "answer of Question 555"

    })
.then(function(r){
    // console.log(r);
})
.fail(function(e){
    /* handle error */
    console.log("error")
});


jf.getFormFiles('30804287175961')
.then(function(r){
    // console.log(r);
})
.fail(function(e){
    /* handle error */
});

jf.getFormWebhooks('30804287175961')
.then(function(r){
    // console.log(r);
})
.fail(function(e){
    /* handle error */
});

jf.createFormWebhook('30804287175961', 'http://www.a.com/ppppp.php')
.then(function(r){
    // console.log(r);
})
.fail(function(e){
    /* handle error */
});

jf.getSubmission("243510723431851030")
.then(function(r){
    // console.log(r);
})
.fail(function(e){
    /* handle error */
});

jf.getReport("32393972741057")
.then(function(r){
    // console.log(r);
})
.fail(function(e){
    /* handle error */
});

jf.getFolder("511369454e0b63771d000003")
.then(function(r){
    // console.log(r);
})
.fail(function(e){
    /* handle error */
});

// jf.createForm(
//     {
//         "questions[0][type]": "control_head",
//         "questions[0][text]": "Created form title",
//         "questions[0][order]": "0",
//         "questions[0][name]":"Header",
//         "properties[title]": "Created by api 3",
//         "properties[height]" : "600"

//     })
// .then(function(r){
//     // console.log(r);
// })
// .fail(function(e){
//     /* handle error */
//     console.log("error on form creattion")
// });

// jf.createForms({
//     "questions" : [{
//         "type":"control_head",
//          "text":"Form Title-PUT th shit",
//          "order":"1",
//          "name":"Header"
//     }], 
//     "properties":{
//       "title":"New Form11- put the hit",
//       "height":"600"
//     }
// })
// .then(function(r){
//     // console.log(r);
// })
// .fail(function(e){
//     /* handle error */
//     console.log("error on form creattion");
//     console.log(e);
// });

// jf.deleteForm('32404090109948')
// .then(function(r){
//     // console.log(r);
// })
// .fail(function(e){
//     /* handle error */
//     console.log('error on del')
// });

// jf.cloneForm('32403867403956')
// .then(function(r){
//     // console.log(r);
// })
// .fail(function(e){
//     /* handle error */
//     console.log('error on del')
// });
// 
// jf.addFormQuestion( '32403867403956' ,
//     {
//         "question[type]": "control_head",
//         "question[text]": "Created form questions shit",
//         "question[order]": "1",
//         "question[name]":"clickTo",

//     })
// .then(function(r){
//     // console.log(r);
// })
// .fail(function(e){
//     /* handle error */
//     console.log("error on form creattion")
// });
// 
// jf.addFormQuestions( '32403867403956' ,
//     {
//         "questions":{
//             "1":{
//                 "type":"control_head",
//                 "text":"Text 111",
//                 "name":"Header1"
//             }, "2":{
//                 "type":"control_head",
//                 "text":"Text 222",
//                 "name":"Header2"
//             }
//         }
//     })
// .then(function(r){
//     // console.log(r);
// })
// .fail(function(e){
//     /* handle error */
//     console.log("error on form creattion")
// });
// jf.deleteFormQuestion('32403867403956', '1')
// .then(function(r){
//     // console.log(r);
// })
// .fail(function(e){
//     /* handle error */
//     console.log('error on del')
// });

jf.getFormProperties('32403867403956')
.then(function(r){
    console.log(r);
})
.fail(function(e){
    /* handle error */
    console.log('error on del')
});
