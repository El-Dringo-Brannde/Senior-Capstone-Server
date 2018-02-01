let mongo = require('./../database/mongoDB');

class salesAggregates {
   constructor() {
   }

   cityBarGroupBy(city, group) {
      return [
         {
            $match: {
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

   cityPieGroupBy(city, group) {
      return [
         {
            $match: {
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

   statePieGroupBy(state, group) {
      return [
         {
            $match: {
               'state': state,
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

   stateBarGroupBy(state, group) {
      return [
         {
            $match: {
               'state': state,
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