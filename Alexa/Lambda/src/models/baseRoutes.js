module.exports = class baseRoutes {
   constructor() {
      this.serverURL = 'http://35.169.224.183:3105/';
      this.sessionAttributes = {};

      this.buildResponse = require('./../buildResponse');
      this.rp = require('request-promise');
   }

   handleErr(err, callback) {
      let speechOutput = "What was that? I couldn't understand you, please try again";
      let repromptText = err;
      callback(this.sessionAttributes, this.buildResponse('Error', speechOutput, repromptText, false));
   }

   buildQueryString(intentSlots) {
      var route = '';
      var query = intentSlots.type.value + '/';
      delete intentSlots.type

      for (var i in intentSlots) {
         let cur = intentSlots[i];
         if (cur.value && cur.name != 'group')
            query += cur.name.toLowerCase() + '/' + cur.value.toLowerCase() + '/'
         if (cur.value && cur.name == 'group')
            query += '?' + cur.name.toLowerCase() + '=' + cur.value.toLowerCase() + '&';
      }
      console.log(query)
      return query;
   }

   sendBackReturnedData(intentName, data, callback) {
      let speechOutput = "Ok, I went to the route. And I got ";// + JSON.parse(data).data;
      let repromptText = "Ok, I'm trying again.";
      callback(this.sessionAttributes, this.buildResponse(intentName, speechOutput, repromptText, false));
   }


   parseRoute(intent, sessionID, callback) {
      const intentName = intent.name;
      let route = this.buildQueryString(intent.slots)
      let sessionQuery = 'sessionID' + '=' + sessionID
      console.log("Done with intent", sessionQuery);
      this.sendRequest(route, sessionQuery, intentName, callback)

   }

   sendRequest(route, sessionQuery, intentName, callback) {
      console.log(this.serverURL + route.toLowerCase() + sessionQuery);

      this.rp(this.serverURL + route.toLowerCase() + sessionQuery)
         .then(resp => this.sendBackReturnedData(intentName, resp, callback))
         .catch(err => { this.handleErr(err, callback) });
   }

   logRoute() { } // implement logic to log route here
}
