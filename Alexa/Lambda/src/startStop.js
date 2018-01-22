var buildResponse = require('./buildResponse')

module.exports = class startStop {
   constructor() {
      this.welcomeTitle = 'Welcome';
      this.welcomeOutput = "Welcome to Look Boss, No Hands. How can I help you?";
      this.welcomeSessionEnd = false;
      this.exitOutput = 'Thank you for trying Look Boss, No Hands! Have a nice day!';
      this.exitTitle = 'Session Ended';
      this.endSessionEnd = true;
      this.repromptText = "How can I help you?";

      this.buildResponse = buildResponse;

      this.serverURL = 'http://35.169.224.183:3105/';

      this.rp = require('request-promise');
   }

   handleSessionEndRequest(callback) {
      // Setting this to true ends the session and exits the skill.
      callback({},
         this.buildResponse(this.endTitle, this.exitOutput, null, this.endSessionEnd));
   }

   getWelcomeResponse(callback, sessionID) {
      console.log("session id " + sessionID);

      let requestOptions = {
         method: 'POST',
         uri: this.serverURL + 'session/create',
         body: {
            sessionID: sessionID
         },
         json: true
      }

      this.rp(requestOptions)
         .then(resp => callback({},
            this.buildResponse(this.welcomeTitle, this.welcomeOutput, this.repromptText, this.welcomeSessionEnd)))
         .catch(err => this.handleErr(err, callback));
   }
}
