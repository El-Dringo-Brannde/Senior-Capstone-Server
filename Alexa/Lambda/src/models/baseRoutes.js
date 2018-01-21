module.exports = class baseRoutes {
   constructor() {
      this.serverURL = 'http://34.215.212.179:3105/';
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
      var query = '';
      console.log(intentSlots)

      if (intentSlots.Type && intentSlots.Type.value) {
         route = intentSlots.Type.value + '/'
         delete intentSlots.Type
      }
      if (intentSlots.Selector && intentSlots.Selector.value) {
         query += intentSlots.Selector.value;
         delete intentSlots.Selector
      }

      query += '?'
      for (var i in intentSlots)
         if (intentSlots[i].value && intentSlots[i].name){
           route += intentSlots[i].name + '/'
           query += intentSlots[i].name + '=' + intentSlots[i].value.toLowerCase() + '&'
          }
      console.log(route.slice(0, -1) + query.slice(0, -1));
      return route.slice(0, -1) + query;
   }

   sendBackReturnedData(intentName, data, callback) {
      let speechOutput = "Ok, I went to the route. And I got ";// + JSON.parse(data).data;
      let repromptText = "Ok, I'm trying again.";
      callback(this.sessionAttributes, this.buildResponse(intentName, speechOutput, repromptText, false));
   }


   parseRoute(intent, sessionID, callback) {
      const intentName = intent.name;
      var strippedID = sessionID.split(".");
      const sessionQuery = 'session=' + strippedID[1].toLowerCase();

      if (Object.keys(intent.slots).length == 1)
         this.sendRequest(routeVal.toLowerCase(), sessionQuery, intentName, callback)
      else {
         let route = this.buildQueryString(intent.slots)
         console.log("Done with intent");
         this.sendRequest(route, sessionQuery, intentName, callback)
      }
   }

   sendRequest(route, sessionQuery, intentName, callback) {
     console.log("session" + sessionQuery);
      this.rp(this.serverURL + route.toLowerCase() + sessionQuery)
         .then(resp => this.sendBackReturnedData(intentName, resp, callback))
         .catch(err => this.handleErr(err, callback));
   }

   logRoute() { } // implement logic to log route here
}
