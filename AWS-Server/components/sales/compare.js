let mongo = require('./../../database/mongoDB');
let util = require('./compareLogic');

module.exports = class compareSales extends mongo {
   constructor(mongo, collection, socket) {
      super(mongo, collection, socket);
      this.util = new util();
   }

   /**
    * async avgInState - Find the highest and lowest values in a state for a
    * given grouping
    *
    * @param  {type} city     description
    * @param  {type} state    State to search
    * @param  {type} grouping How to group sales
    * @return {type}          Highest and lowest sale numbers for given group
    */
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

   /**
    * async avgInCity - description
    *
    * @param  {type} city  City to search within
    * @param  {type} state State to seach within
    * @param  {type} group Method of grouping sales
    * @param  {type} name  description
    * @return {type}       Highest and lowest sales numbers for given
    * city, state
    */
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
