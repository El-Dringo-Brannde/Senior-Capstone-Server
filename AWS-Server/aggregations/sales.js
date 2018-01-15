let mongo = require('./../database/mongoDB');

class salesAggregates extends mongo {
   constructor(mongo, collName, socket) {
      super(mongo, collName, socket);
   }

   matchProjectAgg(matchObj) {
      return [{
         $match: matchObj
      },
      {
         $project: {
            totalSales: {
               $sum: '$sales.price'
            },
            place: {
               city: '$city',
               state: '$state'
            }
         }
      }]
   }

   cityStateByBrand(city, state, brand) {
      return [
         {
            $match: {
               'state': state,
               'city': city,
            }
         },
         {
            $unwind: '$sales'
         },
         {
            $match: {
               'sales.brand': brand
            }
         },
         {
            $group: {
               _id: brand + ' sales',
               sales: {
                  $sum: '$sales.price'
               }
            }
         }
      ]
   }
}

module.exports = salesAggregates