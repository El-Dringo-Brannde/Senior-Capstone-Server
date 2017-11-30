var socket = require("socket.io-client")("http://34.215.212.179:3001");
var MongoClient = require('mongodb').MongoClient, f = require('util').format, assert = require('assert');

var user = "";
var password = "";
var authMechanism = 'DEFAULT';
var url = f('mongodb://%s:%s@34.215.212.179:27017/sales?authMechanism=%s',
  user, password, authMechanism);

MongoClient.connect(url, function(err, db){
  assert.equal(null, err);
  console.log("connected");

  db.close();
})

socket.on('connect', function () {
  console.log("connected")

  socket.on('query', function(msg){
    console.log(msg);

    MongoClient.connect(url, function(err, db){

    })
  });
});
