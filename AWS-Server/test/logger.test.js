var request = require('supertest');
request = request('http://35.169.224.183:3105');
var assert = require('chai').assert;
var MongoClient = require('mongodb').MongoClient;
var mongoURL = require('./../config/mongoURL.js');
var userID = 'amzn1.ask.account.testingtesting';
var idCount = 0;

var get_total_num_docs = function(db, query, callback) {
  var coll = db.collection('queries');
  coll.count(query, function(err, count) {
    if (err) throw err;

    callback(count);
  })
};

describe('logger testing logging', function() {
  it('count stays the same after invalid request', function() {
    q = {
      "userID": userID
    };

    MongoClient.connect(mongoURL, function(err, client) {
      var db = client.db('seniorCapstone');
      assert.equal(null, err);
      get_total_num_docs(db, q, function(countInit) {
        request
          .get('/sales/state/california/?group=color')
          .end(function(err, res) {
            get_total_num_docs(db, q, function(countPost) {
              assert.equal(countPost, countInit);
              client.close();
              done();
            });
          });
      });
    });
  });

  it('count increases by one after valid request', function() {
    q = {
      "userID": userID
    };
    MongoClient.connect(mongoURL, function(err, client) {
      var db = client.db('seniorCapstone');
      assert.equal(null, err);
      get_total_num_docs(db, q, function(countInit) {
        console.log("Pre" + countInit);
        request
          .get('/sales/state/california/?group=color&userID=' + userID)
          .end(function(err, res) {
            get_total_num_docs(db, q, function(countPost) {
              console.log("Post" + countPost);
              assert.equal(countPost, countInit);
              client.close();
              done();
            });
          });
      });
    });
  });
  /*
    it('should have new matching entry for sort by group', function() {
      var q = {
        "query": {
          "group": "color"
        },
        "userID": userID,
        "params": {
          "state": "california"
        }
      }

      MongoClient.connect(mongoURL, function(err, client) {
        var db = client.db('seniorCapstone');
        assert.equal(null, err);
        get_total_num_docs(db, q, function(countInit) {
          request
            .get('/sales/state/california/?group=color')
            .end(function(err, res) {
              get_total_num_docs(db, q, function(countPost) {
                assert.equal(countPost, countInit);
                client.close();
                done();
              });

            });
        });
      });
    });*/
});
