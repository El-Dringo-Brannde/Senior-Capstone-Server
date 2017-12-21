module.exports = function () {
    var self = this;
    var routes = require('./routes')
    var startStop = require('./startEnd')
    // --------------- Events -----------------------
 
    /**
     * Called when the user launches the skill without specifying what they want.
     */
    self.onLaunch = function (launchRequest, session, callback) {
       // Dispatch to your skill's launch.
       startStop.getWelcomeResponse(callback);
    }
 
    /**
     * Called when the user specifies an intent for this skill.
     */
    self.onIntent = function (intentRequest, session, callback) {
       const intent = intentRequest.intent;
       const intentName = intentRequest.intent.name;
 
       // Dispatch to your skill's intent handlers
       if (intentName === 'Send') {
          routes(intent, session, callback);
       } else if (intentName === 'AMAZON.HelpIntent') {
          startStop.getWelcomeResponse(callback);
       } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
          startStop.handleSessionEndRequest(callback);
       } else {
          throw new Error('Invalid intent');
       }
    }
 
    /**
     * Called when the user ends the session.
     * Is not called when the skill returns shouldEndSession=true.
     */
    self.onSessionEnded = function (sessionEndedRequest, session) {
       // console.log("onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}");
       // Add cleanup logic here
    }
    return self;
 }