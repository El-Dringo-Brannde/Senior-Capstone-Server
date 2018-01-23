var router = require('express').Router();
var expressValidator = require('express-validator');
var sales = require('./../logic/sales');
let util = require('util');



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

   // Test for Express-validator
    router.get('/test_validator', (req, response, next) => {
       req.checkQuery('state', '"State" can not be empty and must be a string').isNotEmpty();
       req.checkQuery('city', '"City" not be empty').isNotEmpty();
       req.getValidationResult().then((validationResult) => {
          if(!validationResult.isEmpty()) {
              response.json({
                  result: "failed",
                  message: `Validation errors: ${util.inspect(validationResult.array())}`
              });
              return;
          }
          //otherwise show
            response.json({
                result: "ok",
                messsage: `Validate input successfully. Input params = ${util.inspect(request.query)}`
            });
          });
    });


   return router;
};
