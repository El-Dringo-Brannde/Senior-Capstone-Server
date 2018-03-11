module.exports = class baseRoutes {
   constructor() {
      this.serverURL = 'http://35.169.224.183:3105/';
      this.sessionAttributes = {};

      this.buildResponse = require('./../buildResponse');
      this.rp = require('request-promise');
   }

   // entry point to parsing routes
   parseRoute(intent, userID, callback) {
      const intentName = intent.name;
      let response = this.changeView(intent, userID, intentName, callback)
      if (intent.slots.view.value == 'map')
         return
      else {
         delete intent.slots.view
         let route = this.buildQueryString(intent.slots)
         let sessionQuery = 'userID' + '=' + userID
         this.sendRequest(route, sessionQuery, intentName, callback)
      }
   }

   handleErr(err, callback) {
      let speechOutput = "What was that? I couldn't understand you, please try again";
      let repromptText = err;
      callback(this.sessionAttributes, this.buildResponse('Error', speechOutput, repromptText, false));
   }

   buildQueryString(intentSlots) {
      var route = '';
      var query = intentSlots.type.value + '/';
      var reset = '';
      delete intentSlots.type

      for (var i in intentSlots) {
         let cur = intentSlots[i];
         if(cur && cur.value && cur.name == 'reset'){
           reset = cur.value.toLowerCase();
         }
         else if (cur && cur.value && cur.name != 'group' && cur.name != 'reset')
            query += cur.name.toLowerCase() + '/' + cur.value.toLowerCase() + '/'
         else if (cur && cur.value && cur.name == 'group')
            query += '?' + cur.name.toLowerCase() + '=' + cur.value.toLowerCase() + '&';
      }

      if(reset != '')
        query += reset + '&';
      console.log(query);
      return query;
   }

   sendBackReturnedData(intentName, response, callback) {
      response = JSON.parse(response);
      let speechOutput = response.speechlet
      let repromptText = "Oh noes, Something went wrong, please try again.";
      callback(this.sessionAttributes, this.buildResponse(intentName, speechOutput, repromptText, false));
   }

   changeView(intents, userID, intentName, callback) {
      if (intents.slots.view.value == 'map') {
         let query = this.pullMapViewParams(intents, userID)
         this.rp(this.serverURL + query)
            .then(resp => {
               query = query.replace('mapView', 'map')
               this.rp(this.serverURL + query + `&group=${intents.slots.group.value}`)
                  .then(resp => {
                     this.sendBackReturnedData(intentName, resp, callback)
                  })
            });
      } else
         this.rp(this.serverURL + 'sales/home')
         .then(resp => console.log(resp));
   }

   pullMapViewParams(intents, userID) {
      let url = 'sales/mapView/name/'
      url += intents.slots.location.value + '/'
      delete intents.slots.location
      url += 'state/' + intents.slots.state.value + '/'
      url += 'city/' + intents.slots.city.value + '/'
      url += `?userID=${userID}`
      return url
   }

   sendRequest(route, sessionQuery, intentName, callback) {
      this.rp(this.serverURL + route.toLowerCase() + sessionQuery)
         .then(resp => this.sendBackReturnedData(intentName, resp, callback))
         .catch(err => {
            this.handleErr(err, callback)
         });
   }

   logRoute() {} // implement logic to log route here
}
