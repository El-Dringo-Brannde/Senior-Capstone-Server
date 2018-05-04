// because I can't do complicated stuff in MongoDB
module.exports = class suggestionLogic {
   constructor() {}

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

   avgGroupsThroughoutState(groups) {
      let obj = {};
      for (const group in groups) {
         let cur = groups[group]
         obj[group] = cur.sum / cur.count
      }
      return obj
   }

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
