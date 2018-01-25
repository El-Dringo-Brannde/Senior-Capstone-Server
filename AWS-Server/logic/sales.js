let salesAgg = require('./../aggregations/sales');
let mongo = require('./../database/mongoDB');
let salesUtility = require('./../utility/sales');

module.exports = class sales extends mongo {
   constructor(mongo, collName, socket) {
      super(mongo, collName, socket);
      this.aggregateBuilder = new salesAgg(mongo, collName, socket);
      this.utility = salesUtility
   }

   async cityGroupBy(city, grouping, user) {
      let barObj = {}, pieObj = {};

      let pieAgg = this.aggregateBuilder.cityPieGroupBy(city, grouping)
      let pieRes = await this.aggregate(pieAgg)
      pieObj = this.utility.arrayToObject(pieRes)

      let barAgg = this.aggregateBuilder.cityBarGroupBy(city, grouping)
      let barRes = await this.aggregate(barAgg);
      barObj = this.utility.pullGroupToObjectKey(barRes)

      this.socketIO.socket.emit('Bar_Chart', {
         data: barObj,
         user: user
      })

      this.socketIO.socket.emit('Pie_Chart', {
         data: pieObj,
         user: user
      })

      return {
         pieChart: pieObj,
         barChart: barObj,
         user: user
      }
   }

   async stateGroupBy(state, grouping, user) {
      let barObj = {}, pieObj = {};
      let pieAgg = this.aggregateBuilder.statePieGroupBy(state, grouping)
      let pieRes = await this.aggregate(pieAgg)
      pieObj = this.utility.arrayToObject(pieRes)

      let barAgg = this.aggregateBuilder.stateBarGroupBy(state, grouping)
      let barRes = await this.aggregate(barAgg)
      barObj = this.utility.pullGroupToObjectKey(barRes)


      this.socketIO.socket.emit('Bar_Chart', {
         data: barObj,
         user: user
      })

      this.socketIO.socket.emit('Pie_Chart', {
         data: pieObj,
         user: user
      })

      return {
         pieChart: pieObj,
         barChart: barObj,
         user: user
      }
   }

   async cityStateGroupBy(city, state, group, user) {
      let pieObject = {}, barObject = {};

      let pieAgg = this.aggregateBuilder.cityStatePieGroupBy(city, state, group);
      pieObject = await this.aggregate(pieAgg)
      pieObject = this.utility.arrayToObject(pieObject)

      let barAgg = this.aggregateBuilder.cityStateBarGroupBy(city, state, group)
      barObject = await this.aggregate(barAgg);
      barObject = this.utility.pullGroupToObjectKey(barObject);

      this.socketIO.socket.emit('Bar_Chart', {
         data: barObject,
         user: user
      })

      this.socketIO.socket.emit('Pie_Chart', {
         data: pieObject,
         user: user
      })
      return {
         pieChart: pieObject,
         barChart: barObject,
         user: user
      } // ghetto way of doing math NOT in mongoDB
   }
}