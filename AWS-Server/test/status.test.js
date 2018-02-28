var request = require('supertest');
request = request('http://35.169.224.183:3105');
var assert = require('chai')
   .assert;

describe('sales testing route', function () {
   it('should get back hello world', function (done) {
      request
         .get('/test')
         .end((err, res) => {
            assert.equal(res.body.data, "You did the thing!!!");
            done();
         });
   });
});
