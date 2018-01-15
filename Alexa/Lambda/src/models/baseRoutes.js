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
      var query = '';
      console.log(intentSlots)

      if (intentSlots.Type) {
         query = intentSlots.Type.value + '/'
         delete intentSlots.Type
      }
      if (intentSlots.Selector) {
         query += intentSlots.Selector.value;
         delete intentSlots.Selector
      }

      query += '?'
      for (var i in intentSlots)
         if (intentSlots[i].value)
            query += intentSlots[i].name + '=' + intentSlots[i].value.toLowerCase() + '&'
      console.log(query)
      return query
   }

   sendBackReturnedData(intentName, data, callback) {
      let speechOutput = "Ok, I went to the route. And I got " + JSON.parse(data).data;
      let repromptText = "Ok, I'm trying again.";
      callback(this.sessionAttributes, this.buildResponse(intentName, speechOutput, repromptText, false));
   }


   parseRoute(intent, callback) {
      const intentName = intent.name;
      const Route = intent.slots.Route;

      if (Object.keys(intent.slots).length == 1)
         this.sendRequest(routeVal.toLowerCase(), intentName, callback)
      else {
         let route = this.buildQueryString(intent.slots)
         this.sendRequest(route, intentName, callback)
      }
   }

   sendRequest(route, intentName, callback) {
      this.rp(this.serverURL + route.toLowerCase())
         .then(resp => this.sendBackReturnedData(intentName, resp, callback))
         .catch(err => this.handleErr(err, callback));
   }

   logRoute() { } // implement logic to log route here
}