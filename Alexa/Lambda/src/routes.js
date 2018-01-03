var baseRoute = require('./models/baseRoutes');

module.exports = class routes extends baseRoute {
   constructor() {
      super();
   }

   goToRoute(intent, callback) {
      this.parseRoute(intent, callback);
   }
}