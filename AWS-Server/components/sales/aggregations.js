/**
 * Create a query for the database from the request the user made
 */
class salesAggregates {
   constructor() {}

   mapLatLng(city, state, name) {
      return [{
            $match: {
               state: {
                  $regex: state,
                  $options: 'i'
               },
               city: {
                  $regex: city,
                  $options: 'i'
               }
            }
         },
         {
            $unwind: '$dealerships'
         },
         {
            $match: {
               'dealerships.name': {
                  $regex: name,
                  $options: 'i'
               }
            }
         },
         {
            $project: {
               _id: 0,
               lat: '$dealerships.lat',
               lng: '$dealerships.lng'
            }
         }
      ]
   }

   cityBarGroupBy(city, group) {
      return [{
            $match: {
               'city': {
                  $regex: city,
                  $options: 'i'
               },
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
            $sort: {
               _id: 1
            }
         },
      ]
   }

   cityPieGroupBy(city, group) {
      return [{
            $match: {
               'city': {
                  $regex: city,
                  $options: 'i'
               }
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
      return [{
            $match: {
               'state': {
                  $regex: state,
                  $options: 'i'
               },
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
      return [{
            $match: {
               'state': {
                  $regex: state,
                  $options: 'i'
               },
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
            $sort: {
               _id: 1
            }
         },
      ]
   }

   cityStateBarGroupBy(city, state, group) {
      return [{
            $match: {
               'state': {
                  $regex: state,
                  $options: 'i'
               },
               'city': {
                  $regex: city,
                  $options: 'i'
               },
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
            $sort: {
               _id: 1
            }
         },
      ]
   }

   mapCityStateBarGroupBy(city, state, group, name) {
      return [{
            $match: {
               'state': {
                  $regex: state,
                  $options: 'i'
               },
               'city': {
                  $regex: city,
                  $options: 'i'
               },
            }
         },
         {
            $unwind: '$sales'
         },
         {
            $match: {
               'sales.dealership': {
                  $regex: name,
                  $options: 'i'
               }
            }
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
            $sort: {
               _id: 1
            }
         },
      ]
   }

   cityStatePieGroupBy(city, state, group) {
      return [{
            $match: {
               'state': {
                  $regex: state,
                  $options: 'i'
               },
               'city': {
                  $regex: city,
                  $options: 'i'
               },
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

   mapCityStatePieGroupBy(city, state, group, name) {
      return [{
            $match: {
               'state': {
                  $regex: state,
                  $options: 'i'
               },
               'city': {
                  $regex: city,
                  $options: 'i'
               },
            }
         },
         {
            $unwind: '$sales'
         },
         {
            $match: {
               'sales.dealership': {
                  $regex: name,
                  $options: 'i'
               }
            }
         }, {
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
