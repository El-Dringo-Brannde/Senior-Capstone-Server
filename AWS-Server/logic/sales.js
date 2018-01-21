let salesAgg = require('./../aggregations/sales');
let mongo = require('./../database/mongoDB');
let salesUtility = require('./../utility/sales');

module.exports = class sales extends mongo {
   constructor(mongo, collName, socket) {
      super(mongo, collName, socket);
      this.aggregateBuilder = new salesAgg(mongo, collName, socket);
      this.utility = salesUtility
   }

   async newSession(sessionID) {
      this.socketIO.newRoom(sessionID);
      return;
   }

   async cityGroupBy(city, grouping) {
      let barObj = {}, pieObj = {};

      let pieAgg = this.aggregateBuilder.cityPieGroupBy(city, grouping)
      let pieRes = await this.aggregate(pieAgg)
      pieObj = this.utility.arrayToObject(pieRes)

      let barAgg = this.aggregateBuilder.cityBarGroupBy(city, grouping)
      let barRes = await this.aggregate(barAgg);
      barObj = this.utility.pullGroupToObjectKey(barRes)

      return {
         pieChart: pieObj,
         barChart: barObj
      }
   }

   async stateGroupBy(state, grouping) {
      let barObj = {}, pieObj = {};
      let pieAgg = this.aggregateBuilder.statePieGroupBy(state, grouping)
      let pieRes = await this.aggregate(pieAgg)
      pieObj = this.utility.arrayToObject(pieRes)

      let barAgg = this.aggregateBuilder.stateBarGroupBy(state, grouping)
      let barRes = await this.aggregate(barAgg)
      barObj = this.utility.pullGroupToObjectKey(barRes)

      return {
         pieChart: pieObj,
         barChart: barObj
      }
   }

   async allByCityState(city, state, sessionID) {
      let matchObj = { city: city, state: state }
      let returnObj = {};

      this.socketIO.newRoom(sessionID);

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



   async cityStateGroupBy(city, state, group) {
      let pieObject = {}, barObject = {};

      let pieAgg = this.aggregateBuilder.cityStatePieGroupBy(city, state, group);
      pieObject = await this.aggregate(pieAgg)
      pieObject = this.utility.arrayToObject(pieObject)

      let barAgg = this.aggregateBuilder.cityStateBarGroupBy(city, state, group)
      barObject = await this.aggregate(barAgg);
      barObject = this.utility.pullGroupToObjectKey(barObject);

      this.socketIO.socket.emit('Bar_Chart', barObject)
      this.socketIO.socket.emit('Pie_Chart', pieObject)
      return {
         pieChart: pieObject,
         barChart: barObject
      } // ghetto way of doing math NOT in mongoDB
   }
}