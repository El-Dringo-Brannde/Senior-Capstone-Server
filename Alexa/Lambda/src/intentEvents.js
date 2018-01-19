var startStop = require('./startStop');
var routes = require('./routes');

module.exports = class events {
   constructor() {
      this.startStop = new startStop();
      this.routes = new routes();
   }

   /**
    * Called when the user launches the skill without specifying what they want.
    */
   onLaunch(callback) {
      this.startStop.getWelcomeResponse(callback);
   }

   /**
    * Called when the user ends the session.
    * Is not called when the skill returns shouldEndSession=true.
    */
   onSessionEnded(sessionEndedRequest, session) { }


   /**
   * Called when the user specifies an intent for this skill.
   */
   onIntent(intentRequest, sessionID, callback) {
      const intent = intentRequest.intent;
      const intentName = intentRequest.intent.name;

      // Dispatch to your skill's intent handlers
      if (intentName === 'Capstone')
         this.routes.goToRoute(intent, sessionID, callback);
      else if (intentName === 'AMAZON.HelpIntent')
         startStop.getWelcomeResponse(callback);
      else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent')
         startStop.handleSessionEndRequest(callback);
      else
         throw new Error('Invalid intent');
   }
}