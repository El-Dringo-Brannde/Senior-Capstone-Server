var router = require('express').Router();
var sales = require('./../logic/sales');
let speechlet = require('./../speechlets/sales');
var { check, validationResult } = require('express-validator/check');
let logger = require('./../logic/logger')
let states = require('./../logic/state');

// All routes here are prefixed by the /sales route
module.exports = function(mongo, socket) {
    sales = new sales(mongo, 'sales', socket);
    logger = new logger(mongo, 'queries', null);
    states = new states(mongo, 'states', null);
    speechlet = new speechlet();

    router.use((req, res, next) => next()); // init
    /**
     * [GET] city data with a grouping filter
     *  query: group = brand | color_name, userID  = STRING
     */
    router.get('/city/:city', sales.validation.city(), async (req, res) => {
        sales.validation.checkResult(req, res)

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

        let city = req.params.city;
        let state = req.params.state;
        let grouping = req.query.group;
        let user = req.query.userID;

        let data = await sales.cityStateGroupBy(city, state, grouping, user);
        let speechResponse = speechlet.repeatSpeechlet(city, state, grouping, data);


        res.json({
            data: data,
            speechlet: speechResponse
        })
        logAndUpdate(req, user)
    });

    // [GET] city state data with a grouping filter
    // query: group = brand \ color_name, userID = STRING
    router.get('/state/:state/city/:city', sales.validation.cityState(), async (req, res) => {
        sales.validation.checkResult(req, res);

        let city = req.params.city;
        let state = req.params.state;
        let grouping = req.query.group;
        let user = req.query.userID;

        let data = await sales.cityStateGroupBy(city, state, grouping, user);
        let speechResponse = speechlet.repeatSpeechlet(city, state, grouping, data);


        res.json({
            data: data,
            speechlet: speechResponse
        })
        logAndUpdate(req, user)
    });

    // used to change the view in the VR environment
    router.get('/home', async (req, res) => {
        sales.changeViewToHome();
        res.json({
            data: 'ok'
        });
    });


    router.get('/map/name/:name/state/:state/city/:city', sales.validation.nameCityState(), async (req, res) => {
        sales.validation.checkResult(req, res);
        let name = req.params.name
        let state = req.params.state
        let city = req.params.city
        let user = req.query.userID
        let group = req.query.group

        await sales.changeViewToMap(city, state, name, user);
        let result = await sales.mapCityStateGroupBy(city, state, group, name, user)
        res.json({
            data: result
        });
    });

    function logAndUpdate(req, user) {
        logger.logRoute(req, user);
        states.updateState(req, user);
    }
    return router;
};

