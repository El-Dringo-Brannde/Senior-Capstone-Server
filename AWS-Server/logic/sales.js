var crud = require('./../database/CRUD');
var mongoSalesAggregates = require('./../database/mongoSalesAggregates');

module.exports = class sales extends crud {
   constructor(mongo, collName, socket) {
      super(mongo, collName, socket);
      this.mongoSales = new mongoSalesAggregates(mongo, collName, socket);

   }

   parseRequest(query, res) {
      var searchObj = {
         state: query.state,
         city: query.city
      }
      this.read(searchObj, res);
   }
};