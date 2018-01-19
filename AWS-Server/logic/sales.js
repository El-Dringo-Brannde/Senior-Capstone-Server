var salesAgg = require('./../aggregations/sales');

module.exports = class sales extends salesAgg {
   constructor(mongo, collName, socket) {
      super(mongo, collName, socket);
      this.aggregateBuilder = new salesAgg(mongo, collName, socket);
   }

   async allByCity(city) {
      let matchObj = {
         city: city
      }
      let agg = this.aggregateBuilder.matchProjectAgg(matchObj)
      return await this.aggregate(agg)
   }

   async allByState(state) {
      let matchObj = {
         state: state
      }
      let agg = this.aggregateBuilder.matchProjectAgg(matchObj)
      return await this.aggregate(agg)
   }

   async allByCityState(city, state, sessionID) {
      let matchObj = { city: city, state: state }
      let returnObj = {};

      this.socket.newRoom(sessionID);

      let brands = await this.read(matchObj);
      brands = brands[0].brands;

      let agg1 = this.aggregateBuilder.matchProjectAgg(matchObj);
      returnObj.totalSales = await this.aggregate(agg1);
      returnObj.totalSales = returnObj.totalSales[0]

      for (let brand of brands) {
         let agg = this.aggregateBuilder.cityStateByBrand(city, state, brand);
         returnObj[brand] = await this.aggregate(agg)
         returnObj[brand] = returnObj[brand][0]
      }
      return returnObj
   } // ghetto way of doing math NOT in mongoDB

   async cityStateBrand(city, state) {
      let matchObj = { city: city, state: state }
      let returnObj = {};

      let brands = await this.read(matchObj);
      brands = brands[0].brands;

      let agg1 = this.aggregateBuilder.matchProjectAgg(matchObj);
      returnObj.totalSales = await this.aggregate(agg1);
      returnObj.totalSales = returnObj.totalSales[0]

      for (let brand of brands) {
         let agg = this.aggregateBuilder.cityStateByBrand(city, state, brand);
         returnObj[brand] = await this.aggregate(agg)
         returnObj[brand] = returnObj[brand][0]
      }
      return returnObj
   } // ghetto way of doing math NOT in mongoDB
};
