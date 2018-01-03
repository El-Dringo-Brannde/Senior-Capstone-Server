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


   }

   handleSessionEndRequest(callback) {
      // Setting this to true ends the session and exits the skill.
      callback({},
         this.buildResponse(this.endTitle, this.exitOutput, null, this.endSessionEnd));
   }

   getWelcomeResponse(callback) {
      // If we wanted to initialize the session to have some attributes we could add those here.
      // If the user either does not reply to the welcome message or says something that is not
      // understood, they will be prompted again with this text.
      callback({},
         this.buildResponse(this.welcomeTitle, this.welcomeOutput,
            this.repromptText, this.welcomeSessionEnd));
   }
}