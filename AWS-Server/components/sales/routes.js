/**
 * routes.js
 * The primary file for routing requests
 */
var router = require('express')
   .Router();
var sales = require('./logic');
let speechlet = require('./speechlet');

var {
   check,
   validationResult
} = require('express-validator/check');
let logger = require('./../states/logger');
let refine = require('./../states/refine');
let compare = require('./compare')
let states = require('./../states/state');
let suggestion = require('./../../database/mongoDB');

// All routes here are prefixed by the /sales route
module.exports = function(mongo, socket) {
   sales = new sales(mongo, 'sales', socket);
   logger = new logger(mongo, 'queries', null);
   refine = new refine(mongo, 'queries', null);
   states = new states(mongo, 'states', null);
   compare = new compare(mongo, 'sales', null);
   suggestion = new suggestion(mongo, 'queries', null)
   speechlet = new speechlet();

   router.use((req, res, next) => next()); // init

   /**
    * [GET] city data with a grouping filter
    *  query: group = brand | color_name, userID  = STRING
    */
   router.get('/city/:city', sales.validation.city(), async (req, res) => {
      sales.validation.checkResult(req, res)

      req = await refine.mergeRoute(req);

      let city = req.params.city
      let grouping = req.query.group
      let user = req.query.userID

      let data = await sales.cityGroupBy(city, grouping, user);
      let speechResponse = speechlet.repeatSpeechlet(city, '', grouping, data);

      res.json({
         data: data,
         speechlet: speechResponse
      });
      logAndUpdate(req, user)
   });

   /**
    * [GET] state data with a grouping filter
    * query: group = brand | color_name, userID = STRING
    */
   router.get('/state/:state', sales.validation.state(), async (req, res) => {
      sales.validation.checkResult(req, res);

      req = await refine.mergeRoute(req);

      let state = req.params.state
      let grouping = req.query.group
      let user = req.query.userID;
      let data = await sales.stateGroupBy(state, grouping, user);
      let speechResponse = speechlet.repeatSpeechlet('', state, grouping, data);

      res.json({
         data: data,
         speechlet: speechResponse
      });
      logAndUpdate(req, user)
   });

   // [GET] city state data with a grouping filter
   // query: group = brand \ color_name, userID = STRING
   router.get('/city/:city/state/:state', sales.validation.cityState(), async (req, res) => {
      sales.validation.checkResult(req, res);

      req = await refine.mergeRoute(req);

      let city = req.params.city;
      let state = req.params.state;
      let grouping = req.query.group;
      let user = req.query.userID;

      let data = await sales.cityStateGroupBy(city, state, grouping, user);
      let stateAvg = await compare.avgInState(city, state, grouping);
      let speechResponse = speechlet.repeatSpeechlet(city, state, grouping, data);
      speechResponse = speechlet.addSimilarStats(stateAvg, speechResponse);
      let { suggestion } = await logAndUpdate(req, user)
      speechResponse = speechlet.addSuggestion(suggestion, speechResponse)


      res.json({
         data: data,
         speechlet: speechResponse
      })
      // logAndUpdate(req, user)
   });

   // [GET] city state data with a grouping filter
   // query: group = brand \ color_name, userID = STRING
   router.get('/state/:state/city/:city', sales.validation.cityState(), async (req, res) => {
      sales.validation.checkResult(req, res);
      req = await refine.mergeRoute(req);

      let city = req.params.city;
      let state = req.params.state;
      let grouping = req.query.group;
      let user = req.query.userID;

      let data = await sales.cityStateGroupBy(city, state, grouping, user);
      let stateAvg = await compare.avgInState(city, state, grouping);
      let speechResponse = speechlet.repeatSpeechlet(city, state, grouping, data);
      speechResponse = speechlet.addSimilarStats(stateAvg, speechResponse);

      let { suggestion } = await logAndUpdate(req, user)
      speechResponse = speechlet.addSuggestion(suggestion, speechResponse)

      res.json({
         data: data,
         speechlet: speechResponse
      })

   });

   //switch TO map view, don't populate data just yet.
   router.get('/mapView/name/:name/state/:state/city/:city', sales.validation.nameCityState(), async (req, res) => {
      sales.validation.checkResult(req, res);
      let name = req.params.name
      let state = req.params.state
      let city = req.params.city
      let user = req.query.userID

      let result = await sales.changeViewToMap(city, state, name, user);
      res.json({
         data: result
      });
   });

   // Populate data in the VR view.
   router.get('/map/name/:name/state/:state/city/:city', sales.validation.nameGroupCityState(), async (req, res) => {
      sales.validation.checkResult(req, res);
      let name = req.params.name
      let state = req.params.state
      let city = req.params.city
      let user = req.query.userID
      let group = req.query.group

      let result = await sales.mapCityStateGroupBy(city, state, group, name, user)
      let cityAvg = await compare.avgInCity(city, state, group, name)
      let speechResponse = speechlet.repeatDealershipSpeechlet(city, state, name, group, result);
      speechResponse = speechlet.addSimilarStats(cityAvg, speechResponse);
      let { suggestion } = await logAndUpdate(req, user)
      speechResponse = speechlet.addSuggestion(suggestion, speechResponse)
      res.json({
         data: result,
         speechlet: speechResponse
      });
   });

   //accept a suggestion
   router.get('/last/user/:userID', async (req, res) => {
      let suggested = await suggestion.getSuggestion(req.params.userID)
      suggested = suggested[0].suggestion
      suggested = await sales.parseSuggestion(suggested.params, suggested.query)

      res.json({
         data: suggested.data,
         speechlet: suggested.speech
      })
   });

   // used to change the view in the VR environment
   router.get('/home', async (req, res) => {
      sales.changeViewToHome();
      res.json({
         data: 'ok'
      });
   });
   // log the latest request and update session state
   function logAndUpdate(req, user) {
      let lastQuery = logger.logRoute(req, user);
      states.updateState(req, user);
      return lastQuery
   }
   return router;
};
