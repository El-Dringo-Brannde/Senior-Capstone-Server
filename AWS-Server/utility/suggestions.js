let mongo = require('./../database/mongoDB');
let util = require('./suggestionLogic');

module.exports = class suggestions extends mongo {
   constructor(mongo, collection, socket) {
      super(mongo, collection, socket);
      this.util = new util();
   }

   async suggestState(city, state, grouping) {
      let stateCities = await this.read({ state: state })
      let avgeragedCities = this.util.sumGroupSalesWithinCity(stateCities, grouping);
      let summedGroups = this.util.sumBrandsThroughoutCities(avgeragedCities);
      let averagedGroups = this.util.avgBrands(summedGroups);
      let highest = this.util.findHighest(averagedGroups)
      let lowest = this.util.findLowest(averagedGroups)
      return averagedGroups;
   }
}