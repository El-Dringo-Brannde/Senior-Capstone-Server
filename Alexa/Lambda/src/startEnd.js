var buildResponse = require('./buildResponse')
module.exports = {

   // --------------- Functions that control the skill's behavior -----------------------
   getWelcomeResponse: function (callback) {
      // If we wanted to initialize the session to have some attributes we could add those here.
      const sessionAttributes = {};
      const cardTitle = 'Welcome';
      const speechOutput = "Welcome to Look Boss, No Hands. How can I help you?"
      // If the user either does not reply to the welcome message or says something that is not
      // understood, they will be prompted again with this text.
      const repromptText = "How can I help you?";
      const shouldEndSession = false;

      callback(sessionAttributes,
         buildResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
   },
   handleSessionEndRequest: function (callback) {
      const cardTitle = 'Session Ended';
      const speechOutput = 'Thank you for trying Look Boss, No Hands! Have a nice day!';
      // Setting this to true ends the session and exits the skill.
      const shouldEndSession = true;

      callback({}, buildResponse(cardTitle, speechOutput, null, shouldEndSession));
   }
}