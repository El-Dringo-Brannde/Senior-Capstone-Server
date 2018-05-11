let mongoDB = require('./../../database/mongoDB')

module.exports = class refine extends mongoDB {
   constructor(mongoDB, collName) {
      super(mongoDB, collName, null)
   }

   /**
    * async mergeRoute - Merge current request with previous one to allow
    * for request refinement
    * e.g., initial request made for sales in Oregon, allow for request of
    * Portland to automatically search for Portland, Oregon
    *
    * @param  {type} req JSON object of current request
    * @return {type}     JSON object of merged request
    */
   async mergeRoute(req) {
      if (req.query.reset) {
         let user = req.query.userID;
         let lastRequest = await this.findLast(user);

         let mergedRoute = Object.assign({}, lastRequest[0], req);
         mergedRoute.params = Object.assign({}, lastRequest[0].params, req.params);
         mergedRoute.query = Object.assign({}, lastRequest[0].query, req.query);
         return mergedRoute;
      }
      else
         return req;
   }
}
