var baseRoute = require('./models/baseRoutes');

module.exports = class routes extends baseRoute {
   constructor() {
      super();
   }

   goToRoute(intent, sessionID, callback) {
      this.parseRoute(intent, sessionID, callback);
   }
}
