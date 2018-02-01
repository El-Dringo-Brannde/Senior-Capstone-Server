var baseRoute = require('./models/baseRoutes');

module.exports = class routes extends baseRoute {
   constructor() {
      super();
   }

   goToRoute(intent, userID, callback) {
      this.parseRoute(intent, userID, callback);
   }
}
