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

   async cityStateBrand(city, state, brand) {
      let agg = this.aggregateBuilder.cityStateByBrand(city, state, brand);
      return await this.aggregate(agg)
   }
};