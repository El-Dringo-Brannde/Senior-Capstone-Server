var router = require('express').Router();

// All routes here are prefixed by the /test route
module.exports = function() {
   router.use((req, res, next) => next()); // init

   router.get('/', (req, res) => {
      res.json({
         data: "You did the thing!!!"
      });
   });

   return router;
};