var request = require('supertest');
request = request('http://35.169.224.183:3105');
var assert = require('chai').assert;

var colors = ['Blue', 'White', 'Black', 'Silver', 'Red']


describe('State sales routes', function() {

   it('should get back an error regarding incorrect userID params', function(done) {
      request
         .get('/sales/state/california/?group=color')
         .end(function(err, res) {
            assert.exists(res.body.error.userID)
            assert.equal(res.body.error.userID.msg, 'Invalid value')
            done();
         });
   });

   it('should get data back from the request', function(done) {
      var userID = 'amzn1.ask.account.AHNWAHWU4XEGXMVIRTGD7E7K6FWMEYQEYXOKEJPEYRRB7HXPSRUAYSI27OITQKHXETSIQE4L7Y3YNHMIKJROBL24DJH3GJUNRXCS6QTMJKJL64DUIZ3LJWAU3GF2PLITSVW7VLXP2GJSMORRXXWAOWSTVCL6QE2UOASGKVCG3AMNN4CIQQQAXMPD3A2PPLQGTSLVPMHZONBKU3A'
      request
         .get('/sales/state/california/?group=color&userID=' + userID)
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
         .get('/sales/state/california/?group=color&userID=' + userID)
         .end(function(err, res) {
            let response = res.body.data;
            assert.includeMembers(colors, Object.keys(response.pieChart))
            let pieChartValues = Object.values(response.pieChart);
            for (var i of pieChartValues)
               assert.isNumber(i)
            done();
         });
   });

   it('should get the correct data back from the barChart request', function(done) {
      var userID = 'amzn1.ask.account.AHNWAHWU4XEGXMVIRTGD7E7K6FWMEYQEYXOKEJPEYRRB7HXPSRUAYSI27OITQKHXETSIQE4L7Y3YNHMIKJROBL24DJH3GJUNRXCS6QTMJKJL64DUIZ3LJWAU3GF2PLITSVW7VLXP2GJSMORRXXWAOWSTVCL6QE2UOASGKVCG3AMNN4CIQQQAXMPD3A2PPLQGTSLVPMHZONBKU3A'
      request
         .get('/sales/state/california/?group=color&userID=' + userID)
         .end(function(err, res) {
            let response = res.body.data;
            let barChartKeys = Object.keys(response.barChart);
            assert.includeMembers(colors, barChartKeys)

            for (var i of barChartKeys) {
               let cur = response.barChart[i]
               assert.isArray(cur)
               for (var j of cur) {
                  assert.property(j, 'sales')
                  assert.property(j, 'month')
               }
            }
            done();
         });
   });
});