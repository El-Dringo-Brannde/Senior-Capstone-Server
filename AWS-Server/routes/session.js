var router = require('express').Router();
var session = require('./../logic/session');

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