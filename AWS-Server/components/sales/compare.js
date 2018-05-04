let mongo = require('./../../database/mongoDB');
let util = require('./compareLogic');

//hackety hack
module.exports = class compareSales extends mongo {
   constructor(mongo, collection, socket) {
      super(mongo, collection, socket);
      this.util = new util();
   }

   async avgInState(city, state, grouping) {
      let stateCities = await this.read({
         state: state
      })
      let summedCities = this.util.sumGroupSalesWithinState(stateCities, grouping);
      let summedGroups = this.util.sumGroupsThroughoutCities(summedCities);
      let averagedGroups = this.util.avgGroupsThroughoutState(summedGroups);
      let highest = this.util.findHighest(averagedGroups)
      let lowest = this.util.findLowest(averagedGroups)
      return {
         highest: highest,
         lowest: lowest
      }
   }

   async avgInCity(city, state, group, name) {
      let cityDealerships = await this.read({
         city: city,
         state: state
      })
      let summedDealerships = this.util.sumGroupSalesWithinCity(cityDealerships[0], group)
      let avgGroups = this.util.avgGroupsWithinCity(summedDealerships)
      let highest = this.util.findHighest(avgGroups)
      let lowest = this.util.findLowest(avgGroups)

      return {
         highest: highest,
         lowest: lowest
      }
   }
}
