var router = require('express').Router();
var sales = require('./../logic/sales');

// All routes here are prefixed by the /sales route
module.exports = function(mongo, socket) {
   sales = new sales(mongo, 'sales', socket);

   router.use((req, res, next) => next()); // init

   router.get('/', (req, res) => {
      sales.read(req.body, res);
   });

   router.get('/:type/:time/', (req, res) => {
      res.json({
         data: 'here is sales ' + req.params.type + ' for ' + req.params.time
      });
   });

   return router;
};