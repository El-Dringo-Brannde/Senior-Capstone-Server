var router = require('express').Router();
var sales = require('./../logic/sales');

// All routes here are prefixed by the /sales route
module.exports = function() {
   router.use((req, res, next) => next()); // init

   router.get('/:type/:time/', (req, res) => {
      res.json({
         data: 'here is sales ' + req.params.type + ' for ' + req.params.time
      });
   });

   return router;
};