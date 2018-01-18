var salesAgg = require('./../aggregations/sales');

module.exports = class sales extends salesAgg {
   constructor(mongo, collName, socket) {
      super(mongo, collName, socket);
      this.aggregateBuilder = new salesAgg(mongo, collName, socket);
   }

   monthDateToMonth(monthNumber) {
      let months = ['January',
         'February',
         'March',
         'April',
         'May',
         'June',
         'July',
         'August',
         'September',
         'October',
         'November',
         'December']
      return months[monthNumber - 1];
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

   async cityStateBrand(city, state) {
      let matchObj = { city: city, state: state }
      let pieObject = {}, barObject = {};
      let brands = await this.read(matchObj);
      brands = brands[0].brands;

      for (let brand of brands) {
         let pieAgg = this.aggregateBuilder.cityStateByBrandPie(city, state, brand);
         let barAgg = this.aggregateBuilder.cityStateByBrandBar(city, state, brand);
         pieObject[brand] = await this.aggregate(pieAgg)
         pieObject[brand] = pieObject[brand][0].sales
         barObject[brand] = await this.aggregate(barAgg)
      }

      for (var brand in barObject)
         for (var month in barObject[brand]) {
            barObject[brand][month].month = this.monthDateToMonth(barObject[brand][month]._id.month)
            delete barObject[brand][month]._id;
         }

      this.socket.emit('Bar_Chart', barObject);
      this.socket.emit('Pie_Chart', pieObject)
      return {
         pieChart: pieObject,
         barChart: barObject
      } // ghetto way of doing math NOT in mongoDB
   }
}