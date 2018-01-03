'use strict';
var events = require('./events')()

// --------------- Helpers that build all of the responses -----------------------

function buildResponse(sessionAttributes, speechletResponse) {
   return {
      version: '1.0',
      sessionAttributes,
      response: speechletResponse,
   };
}

// --------------- Main handler -----------------------

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = (event, context) => {
   try {
      if (event.request.type === 'LaunchRequest') {
         onLaunch(event.request,
            event.session,
            function callback(sessionAttributes, speechletResponse) {
               context.succeed(buildResponse(sessionAttributes, speechletResponse));
            });
      } else if (event.request.type === 'IntentRequest') {
         events.onIntent(event.request,
            event.session,
            function callback(sessionAttributes, speechletResponse) {
               context.succeed(buildResponse(sessionAttributes, speechletResponse));
            });
      } else if (event.request.type === 'SessionEndedRequest') {
         onSessionEnded(event.request, event.session);
         context.succeed();
      }
   } catch (e) {
      context.fail("Exception: " + e);
   }
};