var intentEvents = require('./../intentEvents')

module.exports = class baseHandler {
   constructor(event, context) {
      this.event = event;
      this.context = context;
      this.intentEvents = new intentEvents();
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
      this.intentEvents.onIntent(this.event.request,
         this.event.context.System.user.userId,
         function callback(sessionAttributes, speechletResponse) {
            self.context.succeed(self.buildResponse(sessionAttributes, speechletResponse));
         });
   }

   launchRequest() {
      var self = this;
      this.intentEvents.onLaunch(
         function callback(sessionAttributes, speechletResponse) {
            self.context.succeed(self.buildResponse(sessionAttributes, speechletResponse));
         });
   }

   sessionEndedRequest() {
      this.intentEvents.onSessionEnded(this.event.request, this.event.session);
      this.context.succeed();
   }
}
