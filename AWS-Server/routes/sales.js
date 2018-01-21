var router = require('express').Router();
var sales = require('./../logic/sales');

// All routes here are prefixed by the /sales route
module.exports = function(mongo, socket) {
   sales = new sales(mongo, 'sales', socket);

   router.use((req, res, next) => next()); // init

   router.get('/session', async (req, res) => {
      let sessionID = req.query.session;
      let session = await sales.newSession(sessionID);

      res.sendStatus(200);
   });

   // [GET] total sales for city/state
   router.get('/state/city', async (req, res) => {
      let city = req.query.city
      let state = req.query.state;
      let sessionID = req.query.session;

      let data = await sales.allByCityState(city, state, sessionID);
      res.json({
         data: data
      });
   });

   router.get('/city', async (req, res) => {
      let city = req.query.city
      let data = await sales.allByCity(city);

      res.json({
         data: data
      });
   });

   router.get('/state', async (req, res) => {
      let city = req.query.state
      let data = await sales.allByState(city);

      res.json({
         data: data
      });
   });

   // [GET] breakdown by brands followed by query query
   // query: filter = brand \ color_name
   router.get('/city/:city/state/:state', async (req, res) => {
      let city = req.params.city;
      let state = req.params.state;
      let filter = req.query.filter;

      let data = await sales.cityStateBrand(city, state, filter);

      res.json({
         data: data
      })
   });

   return router;
};
