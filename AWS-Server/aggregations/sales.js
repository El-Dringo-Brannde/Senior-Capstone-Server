let mongo = require('./../database/mongoDB');

class salesAggregates {
   constructor() {
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

   cityStateByBrandBar(city, state, brand) {
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
               _id: {
                  month: {
                     $month: '$sales.date'
                  }
               },
               sales: {
                  $sum: '$sales.price'
               }
            }
         }
      ]
   }

   cityStateBarGroupBy(city, state, group) {
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
            $group: {
               _id: {
                  group: '$sales.' + group,
                  month: {
                     $month: '$sales.date'
                  }
               },
               sales: {
                  $sum: '$sales.price'
               }
            }
         },
         {
            $sort: { _id: 1 }
         },
      ]
   }

   cityStatePieGroupBy(city, state, group) {
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
            $group: {
               _id: '$sales.' + group,
               sales: {
                  $sum: '$sales.price'
               }
            }
         }
      ]
   }
}

module.exports = salesAggregates