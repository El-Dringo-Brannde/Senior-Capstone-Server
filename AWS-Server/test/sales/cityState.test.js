var request = require('supertest');
request = request('http://35.169.224.183:3105');
var assert = require('chai').assert;

var colors = ['Blue', 'White', 'Black', 'Silver', 'Red', 'user']


describe('city state sales route combo', function() {

   it('should get back an error regarding incorrect userID params', function(done) {
      request
         .get('/sales/city/oakland/state/california/?group=color')
         .end(function(err, res) {
            assert.exists(res.body.error.userID)
            assert.equal(res.body.error.userID.msg, 'Invalid value')
            done();
         });
   });

   it('should get data back from the request', function(done) {
      var userID = 'amzn1.ask.account.AHNWAHWU4XEGXMVIRTGD7E7K6FWMEYQEYXOKEJPEYRRB7HXPSRUAYSI27OITQKHXETSIQE4L7Y3YNHMIKJROBL24DJH3GJUNRXCS6QTMJKJL64DUIZ3LJWAU3GF2PLITSVW7VLXP2GJSMORRXXWAOWSTVCL6QE2UOASGKVCG3AMNN4CIQQQAXMPD3A2PPLQGTSLVPMHZONBKU3A'
      request
         .get('/sales/city/petaluma/state/california/?group=color&userID=' + userID)
         .end(function(err, res) {
            let response = res.body.data;
            assert.exists(response.pieChart)
            assert.exists(response.barChart)
            assert.equal(response.user, userID)
            done();
         });
   });

   it('should get the correct data back from the pieChart request', function(done) {
      var userID = 'amzn1.ask.account.AHNWAHWU4XEGXMVIRTGD7E7K6FWMEYQEYXOKEJPEYRRB7HXPSRUAYSI27OITQKHXETSIQE4L7Y3YNHMIKJROBL24DJH3GJUNRXCS6QTMJKJL64DUIZ3LJWAU3GF2PLITSVW7VLXP2GJSMORRXXWAOWSTVCL6QE2UOASGKVCG3AMNN4CIQQQAXMPD3A2PPLQGTSLVPMHZONBKU3A'
      request
         .get('/sales/city/petaluma/state/california/?group=color&userID=' + userID)
         .end(function(err, res) {
            let response = res.body.data;
            assert.includeMembers(colors, Object.keys(response.pieChart))
            for (var i in response.pieChart) {
               if (i != 'user')
                  assert.isNumber(response.pieChart[i])
               else
                  assert.isString(response.pieChart[i])
            }
            done();
         });
   });

   it('should get the correct data back from the barChart request', function(done) {
      var userID = 'amzn1.ask.account.AHNWAHWU4XEGXMVIRTGD7E7K6FWMEYQEYXOKEJPEYRRB7HXPSRUAYSI27OITQKHXETSIQE4L7Y3YNHMIKJROBL24DJH3GJUNRXCS6QTMJKJL64DUIZ3LJWAU3GF2PLITSVW7VLXP2GJSMORRXXWAOWSTVCL6QE2UOASGKVCG3AMNN4CIQQQAXMPD3A2PPLQGTSLVPMHZONBKU3A'
      request
         .get('/sales/city/petaluma/state/california/?group=color&userID=' + userID)
         .end(function(err, res) {
            let response = res.body.data;
            let barChartKeys = Object.keys(response.barChart);
            assert.includeMembers(colors, barChartKeys)

            for (var i of barChartKeys) {
               let cur = response.barChart[i]
               if (i == 'user')
                  assert.isString(cur)
               else {
                  assert.isArray(cur)
                  for (var j of cur) {
                     assert.property(j, 'sales')
                     assert.property(j, 'month')
                  }
               }
            }
            done();
         });
   });

   it('should get the correct data back from the bubbleChart request', function(done) {
      var userID = 'amzn1.ask.account.AHNWAHWU4XEGXMVIRTGD7E7K6FWMEYQEYXOKEJPEYRRB7HXPSRUAYSI27OITQKHXETSIQE4L7Y3YNHMIKJROBL24DJH3GJUNRXCS6QTMJKJL64DUIZ3LJWAU3GF2PLITSVW7VLXP2GJSMORRXXWAOWSTVCL6QE2UOASGKVCG3AMNN4CIQQQAXMPD3A2PPLQGTSLVPMHZONBKU3A'
      request
         .get('/sales/city/petaluma?group=color&userID=' + userID)
         .end(function(err, res) {
            let response = res.body.data;
            let bubbleChartKeys = Object.keys(response.bubbleChart);
            assert.includeMembers(["0", "1", '2', "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "user"], bubbleChartKeys)

            for (var i of bubbleChartKeys) {
               let cur = response.bubbleChart[i]
               if (i == 'user')
                  assert.isString(cur)
               else {
                  assert.isObject(cur)
                  assert.property(cur, 'sales')
                  assert.property(cur, 'month')
               }
            }
            done();
         });
   });
});