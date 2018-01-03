var request = require('supertest');
request = request('http://34.215.212.179:3105');
var assert = require('chai').assert;



describe('basic server testing', function() {

   it('should get back hello world', function(done) {
      request
         .get('/test')
         .end(function(err, res) {
            assert.equal(res.body.data, "You did the thing!!!");
            done();
         });
   });
});