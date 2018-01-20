var buildResponse = require('./buildResponse')

module.exports = class startStop {
   constructor() {
      this.welcomeTitle = 'Welcome';
      this.welcomeOutput = "Welcome to Look Boss, No Hands. Please enter session ID ";
      this.welcomeSessionEnd = false;
      this.exitOutput = 'Thank you for trying Look Boss, No Hands! Have a nice day!';
      this.exitTitle = 'Session Ended';
      this.endSessionEnd = true;
      this.repromptText = "How can I help you?";

      this.buildResponse = buildResponse;

      this.serverURL = 'http://34.215.212.179:3105/';

      this.rp = require('request-promise');
   }

   handleSessionEndRequest(callback) {
      // Setting this to true ends the session and exits the skill.
      callback({},
         this.buildResponse(this.endTitle, this.exitOutput, null, this.endSessionEnd));
   }

   getWelcomeResponse(callback, sessionID) {
      // If we wanted to initialize the session to have some attributes we could add those here.
      // If the user either does not reply to the welcome message or says something that is not
      // understood, they will be prompted again with this text.
      console.log("session id " + sessionID);
      var strippedID = sessionID.split(".");
      var sessionQuery = 'sales/session?session=' + strippedID[3].toLowerCase();
        console.log("Connecting to " + this.serverURL + sessionQuery);
       this.rp(this.serverURL + sessionQuery)
         .then(resp => callback({},
                    this.buildResponse(this.welcomeTitle, this.welcomeOutput + sessionID.slice(-4) + " into your client.",
                   this.repromptText, this.welcomeSessionEnd)))
         .catch(err => this.handleErr(err, callback));
   }
}
