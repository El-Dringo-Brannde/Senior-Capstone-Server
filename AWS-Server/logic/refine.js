let mongoDB = require('./../database/mongoDB')

module.exports = class refine extends mongoDB {
   constructor(mongoDB, collName) {
      super(mongoDB, collName, null)
   }

   async mergeRoute(req){
     console.log(req.query.reset);
     if(!req.query.reset){
       let user = req.query.userID;
       let lastRequest =  await this.findLast(user);

       let mergedRoute = Object.assign({}, lastRequest[0], req);
       mergedRoute.params = Object.assign({}, lastRequest[0].params, req.params);
       mergedRoute.query = Object.assign({}, lastRequest[0].query, req.query);
       console.log(mergedRoute.params)
       return mergedRoute;
     }
     else{
       return req;
     }
   }
}
