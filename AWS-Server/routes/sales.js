var router = require('express').Router();
var expressValidator = require('express-validator');
var sales = require('./../logic/sales');
let util = require('util');



// All routes here are prefixed by the /sales route
module.exports = function (mongo, socket) {
    sales = new sales(mongo, 'sales', socket);

    router.use((req, res, next) => next()); // init

    // [GET] total sales for city/state
    router.get('/city/state', async (req, res) => {
        let city = req.params.city
        let state = req.params.state;
        let data = await sales.allByCityState(city, state);
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

    // [GET] breakdown by brand followed by query params
    // query: state=California&city=Oakland&brand=eagle
    router.get('/brand', async (req, res) => {
        let city = req.query.city;
        let state = req.query.state;
        let brand = req.query.brand;
        let data = await sales.cityStateBrand(city, state, brand);
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