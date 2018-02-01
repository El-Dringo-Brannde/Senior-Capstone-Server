var baseHandler = require('./models/baseHandler');
// --------------- Main handler -----------------------


// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = (event, context) => {
   new handler(event, context);
};

class handler extends baseHandler {
   constructor(event, context) {
      super(event, context);
   }

   onInit() {
      this.parseIntent();
   }

   parseIntent() {
      if (this.event.request.type === 'IntentRequest')
         this.intentRequest();
      else if (this.event.request.type == 'SessionEndedRequest')
         this.sessionEndedRequest();
      else if (this.event.request.type == 'LaunchRequest')
         this.launchRequest();
   }
}