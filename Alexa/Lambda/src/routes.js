module.exports = function controlRoutes(intent, session, callback) {
   const cardTitle = intent.name;
   const Route = intent.slots.Route;
   let repromptText = '';
   let sessionAttributes = {};
   const shouldEndSession = true;
   let speechOutput = '';
   var routeVal = Route.value;
   var buildResponse = require('./buildResponse')
   var http = require('http');

   if (Route) {
      //Update 
      var httpPromise = new Promise(function (resolve, reject) {
         http.get({
            host: '34.215.212.179',
            path: '/test',
            port: '3005'
         }, function (response) {
            resolve(response);
         });
      });
      httpPromise.then(
         function (data) {
            var rawData = '';
            data.on('data', chunk => rawData += chunk)
            data.on('end', () => sendBackReturnedData(cardTitle, Route, rawData, callback))
         },
         function (err) {
            console.log('An error occurred:', err);
         }
      );

   } else {
      speechOutput = "Please try again";
      repromptText = "Please try again";
      callback(sessionAttributes, buildResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
   }



   function sendBackReturnedData(cardTitle, Route, rawData, callback) {
      var sessionAttributes = {};
      var speechOutput = "Ok, I went to the " + Route.value + " route. And I got " + JSON.parse(rawData).data;
      var repromptText = "Ok, I going back to the " + Route.value + " route.";
      callback(sessionAttributes, buildResponse(cardTitle, speechOutput, repromptText, false));
   }

}