var events = require('./../events')()

module.exports = class baseHandler {
   constructor(event, context) {
      this.event = event;
      this.context = context;
      this.onInit();
   }

   onInit() { } // virtual class to be used in children after constructor

   buildResponse(sessionAttributes, speechletResponse) {
      return {
         version: '1.0',
         sessionAttributes,
         response: speechletResponse,
      };
   }

   intentRequest() {
      var self = this;
      events.onIntent(this.event.request,
         events.session,
         function callback(sessionAttributes, speechletResponse) {
            self.context.succeed(self.buildResponse(sessionAttributes, speechletResponse));
         });
   }

   launchRequest() {
      var self = this;
      onLaunch(this.event.request,
         this.event.session,
         function callback(sessionAttributes, speechletResponse) {
            self.context.succeed(self.buildResponse(sessionAttributes, speechletResponse));
         }
      );
   }

   sessionEndedRequest() {
      onSessionEnded(this.event.request, this.event.session);
      this.context.succeed();
   }
}