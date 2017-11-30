'use strict';
var http = require('http');
var request = require('request');
// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
   return {
      outputSpeech: {
         type: 'PlainText',
         text: output,
      },
      card: {
         type: 'Simple',
         title: "SessionSpeechlet - " + title,
         content: "SessionSpeechlet - " + output,
      },
      reprompt: {
         outputSpeech: {
            type: 'PlainText',
            text: repromptText,
         },
      },
      shouldEndSession: shouldEndSession
   };
}

function buildResponse(sessionAttributes, speechletResponse) {
   return {
      version: '1.0',
      sessionAttributes,
      response: speechletResponse,
   };
}


// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
   // If we wanted to initialize the session to have some attributes we could add those here.
   const sessionAttributes = {};
   const cardTitle = 'Welcome';
   const speechOutput = "Welcome to Look Boss, No Hands. How can I help you?"
   // If the user either does not reply to the welcome message or says something that is not
   // understood, they will be prompted again with this text.
   const repromptText = "How can I help you?";
   const shouldEndSession = false;

   callback(sessionAttributes,
      buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
   const cardTitle = 'Session Ended';
   const speechOutput = 'Thank you for trying the Look Boss, No Hands program. Have a nice day!';
   // Setting this to true ends the session and exits the skill.
   const shouldEndSession = true;

   callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

function controlRoutes(intent, session, callback) {
   const cardTitle = intent.name;
   const data_type = intent.slots.Type;
   const brand = intent.slots.Which;
   const when = intent.slots.Time;
   let repromptText = '';
   let sessionAttributes = {};
   const shouldEndSession = true;
   let speechOutput = '';
   var routeVal = Route.value;

   if (data_type && brand && when) {
      //Update
      var options = {
        url: '34.215.212.179:3000/request',
        method: 'POST',
        json: {
          "time": when,
          "brand": brand
        }
      }
      request(options, function(err, res, body){
        if(!error){
          console.log('done!');
          console.log('Function called succesfully:', data);
          speechOutput = "Your request is being processed. Please note that any data displayed is randomly created and is not intended to factually represent any real company.";
          repromptText = "Your request is being processed. Please note that any data displayed is randomly created and is not intended to factually represent any real company.";
          callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        }
        else{
          console.log('error sending request');
          speechOutput = "There was an error sending the request, please try again";
          repromptText = "There was an error sending the request, please try again";
          callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        }
      });
    }
    /*  var httpPromise = new Promise(function (resolve, reject) {
         http.get({
            host: '34.215.212.179',
            path: '/request',
            port: '3000'
         }, function (response) {
            resolve('Done Sending');
         });
      });
      httpPromise.then(
         function (data) {
            console.log('Function called succesfully:', data);
            speechOutput = "Your request is being processed. Please note that any data displayed is randomly created and is not intended to factually represent any real company.";
            repromptText = "Your request is being processed. Please note that any data displayed is randomly created and is not intended to factually represent any real company.";
            callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
         },
         function (err) {
            console.log('An error occurred:', err);
         }
      );*/

   } else {
      speechOutput = "I'm sorry, I didn't quite get that. Please ask in the form of show me sales for brand in year.";
      repromptText = "Please try again";
      callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
   }
}

// --------------- Events -----------------------

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
   // console.log("onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}");

   // Dispatch to your skill's launch.
   getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
   // console.log("onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}");

   const intent = intentRequest.intent;
   const intentName = intentRequest.intent.name;

   // Dispatch to your skill's intent handlers
   if (intentName === 'Server_Request') {
      controlRoutes(intent, session, callback);
   } else if (intentName === 'AMAZON.HelpIntent') {
      getWelcomeResponse(callback);
   } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
      handleSessionEndRequest(callback);
   } else {
      throw new Error('Invalid intent');
   }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
   // console.log("onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}");
   // Add cleanup logic here
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
         onIntent(event.request,
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
