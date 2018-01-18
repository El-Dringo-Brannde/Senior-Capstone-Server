var router = require('express').Router();
var sales = require('./../logic/sales');
var io = require('./../websockets/sockets');

// All routes here are prefixed by the /sales route
module.exports = function (mongo, socket) {
   sales = new sales(mongo, 'sales', socket);

   router.use((req, res, next) => next()); // init

   // [GET] total sales for city/state
   router.get('/city/state', async (req, res) => {
      let city = req.params.city
      let state = req.params.state;
      let data = await sales.allByCityState(city, state);

      io.returnData(data, req.params.session);
      res.json({
         data: data
      });
   });

   router.get('/city', async (req, res) => {
      let city = req.query.city
      let data = await sales.allByCity(city);

      io.returnData(data, req.params.session);
      res.json({
         data: data
      });
   });

   router.get('/state', async (req, res) => {
      let city = req.query.state
      let data = await sales.allByState(city);
      io.returnData(data, req.params.session);
      res.json({
         data: data
      });
   });

   // [GET] breakdown by brands followed by query params
   // query: state=California&city=Oakland
   router.get('/brand', async (req, res) => {
      let city = req.query.city;
      let state = req.query.state;
      let brand = req.query.brand;

      let data = await sales.cityStateBrand(city, state, brand);

      io.returnData(data, req.params.session);
      res.json({
         data: data
      })
   });

   return router;
};
