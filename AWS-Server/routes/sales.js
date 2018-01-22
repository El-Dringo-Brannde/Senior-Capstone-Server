var router = require('express').Router();
var sales = require('./../logic/sales');

// All routes here are prefixed by the /sales route
module.exports = function(mongo, socket) {
   sales = new sales(mongo, 'sales', socket);

   router.use((req, res, next) => next()); // init

   /**
    * [GET] city data with a grouping filter
    *  query: group = brand | color_name
    */
   router.get('/city/:city', async (req, res) => {
      let city = req.params.city
      let grouping = req.query.group
      let data = await sales.cityGroupBy(city, grouping);
      res.json({
         data: data
      });
   });

   /**
    * [GET] state data with a grouping filter
    * query: group = brand | color_name
    */
   router.get('/state/:state', async (req, res) => {
      let state = req.params.state
      let grouping = req.query.group
      let data = await sales.stateGroupBy(state, grouping);
      res.json({
         data: data
      });
   });

   // [GET] city state data with a grouping filter
   // query: group = brand \ color_name
   router.get('/city/:city/state/:state', async (req, res) => {
      let city = req.params.city;
      let state = req.params.state;
      let group = req.query.group;

      let data = await sales.cityStateGroupBy(city, state, group);

      res.json({
         data: data
      })
   });

   return router;
};
