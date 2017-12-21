var request = require('supertest')
request = request('http://34.215.212.179:3000')
var assert = require('chai').assert


//request.get('/').expect(200,function(err) {
  //  console.log(err);
//});

request
    .get('/')
    .end(function(err,res){
       assert.equal(res.text, "Hello world!");
       console.log(res.text);
    });

request
    .get('/test')
    .end(function(err,res){
       // assert.equal(res.text, "Hello world!");
        console.log(res.text);
    });


