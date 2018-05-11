/**
 * Module contining the route to create a new sesion
 */
var router = require('express')
   .Router();
var session = require('./logic');

// All routes here are prefixed by /session
module.exports = () => {

   router.use((req, res, next) => next()); // init

   router.post('/create', (req, res) => {
      let sessionID = req.body.sessionID;
      console.log(sessionID)
      session.addSession(sessionID)

      res.json({
         data: session.getSession(sessionID)
      });
   });

   return router;
}
