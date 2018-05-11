// because I can't do complicated stuff in MongoDB
module.exports = class suggestionLogic {
   constructor() {}

   /**
    * sumGroupSalesWithinState - Calculate sales amount for groups within all
    * cities in a state
    *
    * @param  {type} stateCities Cities to calculate for
    * @param  {type} grouping    How to group sales
    * @return {type}             Total sales amounts for each group    
    */
   sumGroupSalesWithinState(stateCities, grouping) {
      let obj = {}
      for (let city of stateCities) {
         let cityName = city.city
         obj[cityName] = {}
         city.sales.map(sale => {
            let grouped = sale[grouping];
            if (!obj[cityName][grouped])
               obj[cityName][grouped] = sale.price
            else
               obj[cityName][grouped] += sale.price;
         })
      }
      return obj
   }

   /**
    * sumGroupSalesWithinCity - Calculate sales within groups in a city
    *
    * @param  {type} city     City to get sales from
    * @param  {type} grouping How to group sales
    * @return {type}          Sum for each group
    */
   sumGroupSalesWithinCity(city, grouping) {
      let obj = {}
      for (const dealership of city.dealerships)
         obj[dealership.name] = {};
      for (const sale of city.sales)
         obj[sale.dealership][sale[grouping]] = {
            sum: 0,
            count: 0
         }

      for (const sale of city.sales) {
         obj[sale.dealership][sale[grouping]].sum += sale.price
         obj[sale.dealership][sale[grouping]].count += 1
      }
      return obj
   }

   /**
    * sumGroupsThroughoutCities - Calculate the total sale amount of a Given
    * set of cities
    *
    * @param  {type} cities Sales data for the cities
    * @return {type}        Total amount of sales
    */
   sumGroupsThroughoutCities(cities) {
      let obj = {};
      for (const city in cities) {
         let cur = cities[city]
         for (const group in cur) {
            if (!obj[group])
               obj[group] = {
                  sum: cur[group],
                  count: 0
               }
            else {
               obj[group].sum += cur[group]
               obj[group].count += 1
            }
         }
      }
      return obj
   }

   /**
    * avgGroupsWithinCity - Calculate averages sales within a given city
    *
    * @param  {type} summedDealerships Total sales for all dealerships
    * @return {type}                   Average sales for dealerships
    */
   avgGroupsWithinCity(summedDealerships) {
      let obj = {}
      for (const i in summedDealerships) {
         let dealership = summedDealerships[i]
         for (const j in dealership) {
            let brand = dealership[j]
            obj[j] = brand.sum / brand.count
         }
      }
      return obj
   }

   /**
    * avgGroupsThroughoutState - Calculate the average sales for an entire state
    *
    * @param  {type} groups Groups of sales to average
    * @return {type}        Average sale amount for the state
    */
   avgGroupsThroughoutState(groups) {
      let obj = {};
      for (const group in groups) {
         let cur = groups[group]
         obj[group] = cur.sum / cur.count
      }
      return obj
   }

   /**
    * findHighest - given group of sales, identify the highest
    *
    * @param  {type} groups Set of groups to compare
    * @return {type}        Highest sale amount
    */
   findHighest(groups) {
      let lastHigh = 0,
         highest = {}
      for (const group in groups) {
         let cur = groups[group]
         if (cur > lastHigh) {
            highest = {
               [group]: cur
            }
            lastHigh = cur
         }
      }
      return highest
   }

   /**
    * findLowest - Given group of sales, identify the lowest
    *
    * @param  {type} groups Set of groups to compare
    * @return {type}        Lowest sale amount
    */
   findLowest(groups) {
      let lastLow = Math.pow(10, 100),
         lowest = {}
      for (const group in groups) {
         let cur = groups[group]
         if (cur < lastLow) {
            lowest = {
               [group]: cur
            }
            lastLow = cur
         }
      }
      return lowest
   }
}
