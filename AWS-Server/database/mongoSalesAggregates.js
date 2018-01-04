module.exports = class mongoSalesAgg {
   constructor(mongo, collName, socket) {
      this.mongoObj = mongoObj;
      this.db = mongo.collection(collName);
      this.socket = socket;
   }


   async cityStateByBrand(city, state, brand) {
      return await this.db.aggregate([
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
               _id: brand + 'Sales',
               sales: {
                  $sum: '$sales.price'
               }
            }
         }
      ])
   }

   async allByCityState(city, state) {
      return await this.db.aggregate([
         {
            $match: {
               'state': state,
               'city': city
            }
         },
         {
            $project: {
               totalSales: {
                  $sum: '$sales.price'
               }
            }
         }
      ])
   }
}




