var request = require('supertest');
request = request('http://35.169.224.183:3105');
var assert = require('chai').assert;
var MongoClient = require('mongodb').MongoClient;
var mongoURL = require('./../config/mongoURL.js');
var userID = 'amzn1.ask.account.testingtesting';
var idCount = 0;
var async = require('async');

var get_total_num_docs = function(db, query, callback) {
  var coll = db.collection('queries');
  coll.count(query, function(err, count) {
    if (err) throw err;

    callback(count);
  })
};

describe('logger testing logging', function() {
  it('count stays the same after invalid request', function(done) {
    q = {
      "userID": userID
    };

    MongoClient.connect(mongoURL, function(err, client) {
      var db = client.db('seniorCapstone');
      async.series([
        function(callback) {
          get_total_num_docs(db, q, function(count) {
            request
              .get('/sales/state/california/?group=color')
              .end(function(err, res) {
                callback(null, count);
              });
          });
        },
        function(callback) {
          get_total_num_docs(db, q, function(count) {
            callback(null, count);
          });
        }
      ], function(err, results) {
        client.close();
        assert.equal(results[1], results[0]);
        done();
      });
    });
  });

  it('count increases by one after valid request', function(done) {
    q = {
      "userID": userID
    };

    MongoClient.connect(mongoURL, function(err, client) {
      var db = client.db('seniorCapstone');
      assert.equal(null, err);
      async.series([
        function(callback) {
          get_total_num_docs(db, q, function(count) {
            callback(null, count);
          });
        },
        function(callback) {
          request
            .get('/sales/state/california/?group=color&userID=' + userID)
            .end(function(err, res) {
              callback(null, null);
            });
        },
        function(callback) {
          get_total_num_docs(db, q, function(count) {
            callback(null, count);
          });
        }
      ], function(err, result) {
        assert.equal(result[0] + 1, result[2]);
        client.close();
        done();
      });
    });
  });

  it('should have new matching entry for sort by group', function(done) {
    var q = {
      "userID": "amzn1.ask.account.testingtesting",
      "params": {
        "state": "california"
      },
      "query": {
        "group": "color",
        "userID": "amzn1.ask.account.testingtesting"
      }
    };

    MongoClient.connect(mongoURL, function(err, client) {
      var db = client.db('seniorCapstone');
      assert.equal(null, err);
      async.series([
        function(callback) {
          get_total_num_docs(db, q, function(count) {
            callback(null, count);
          });
        },
        function(callback) {
          request
            .get('/sales/state/california/?group=color&userID=' + userID)
            .end(function(err, res) {
              callback(null, null);
            });
        },
        function(callback) {
          get_total_num_docs(db, q, function(count) {
            callback(null, count);
          });
        }
      ], function(err, result) {
        assert.equal(result[0] + 1, result[2]);
        client.close();
        done();
      });
    });
  });
});
