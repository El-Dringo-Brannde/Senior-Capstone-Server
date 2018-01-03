module.exports = function controlRoutes(intent, session, callback) {
      const cardTitle = intent.name;
      const Route = intent.slots.Route;
      let repromptText = '';
      let sessionAttributes = {};
      let speechOutput = '';
      try {
            var routeVal = Route.value;
      } catch (err) { }

      var buildResponse = require('./buildResponse')
      var rp = require('request-promise');
      console.log(buildQueryString())

      if (Object.keys(intent.slots).length == 1)
            rp('http://35.169.224.183:3105/' + routeVal.toLowerCase())
                  .then(resp => sendBackReturnedData(cardTitle, Route, resp, callback))
                  .catch(err => handleErr(err));

      else
            rp('http://35.169.224.183:3105/' + buildQueryString())
                  .then(resp => sendBackReturnedData(cardTitle, Route, resp, callback))
                  .catch(err => handleErr(err));

      function buildQueryString() {
            var query = '';
            console.log(intent.slots)
            for (var i in intent.slots) {
                  if (intent.slots[i].value)
                        query += intent.slots[i].value + '/'
            }

            return query
      }

      function handleErr(err) {
            speechOutput = "What was that? I couldn't understand you, please try again";
            repromptText = err;
            callback(sessionAttributes, buildResponse(cardTitle, speechOutput, repromptText, false));
      }

      function sendBackReturnedData(cardTitle, Route, data, callback) {
            var sessionAttributes = {};
            var speechOutput = "Ok, I went to the " + Route.value + " route. And I got " + JSON.parse(data).data;
            var repromptText = "Ok, I going back to the " + Route.value + " route.";
            callback(sessionAttributes, buildResponse(cardTitle, speechOutput, repromptText, false));
      }

}