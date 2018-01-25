var router = require('express').Router();
var expressValidator = require('express-validator');
let util = require('util');

class paramVal {
    constructor() {
    }
    // Test for Express-validator

    //Param Validation for state
    validateState(state) {
        router.get('/test_validator', (req, response, next) => {
            req.checkQuery('state', '"State" can not be empty and must be a string').notEmpty().isString();
            req.getValidationResult().then((validationResult) => {
                if (!validationResult.isEmpty()) {
                    response.json({
                        result: "failed",
                        message: `Validation errors: ${util.inspect(validationResult.array())}`
                    });
                    return;
                }
                //otherwise show
                response.json({
                    result: "ok",
                    message: `Validate input successfully. Input params = ${util.inspect(request.query)}`
                });
            });
        });
    }

    //Param Validation for city
    validateCity(city) {
        router.get('/test_validator', (req, response, next) => {
            req.checkQuery('city', '"City" not be empty').notEmpty().isString();
            req.getValidationResult().then((validationResult) => {
                if (!validationResult.isEmpty()) {
                    response.json({
                        result: "failed",
                        message: `Validation errors: ${util.inspect(validationResult.array())}`
                    });
                    return;
                }
                //otherwise show
                response.json({
                    result: "ok",
                    message: `Validate input successfully. Input params = ${util.inspect(request.query)}`
                });
            });
        });
    }


    //Param validation for sales
    validateSales(price, date, dealer_id, name, license, color, age, brand) {
        router.get('/test_validator', (req, response, next) => {
            req.checkQuery('price', '"price" can not be empty and must be a int').notEmpty().isInt();
            req.checkQuery('date', '"date" not be empty Example: 2017-09-30 17:00:00.000').notEmpty().isDate();
            req.checkQuery('dealer_id', '"dealer id" can not be empty and must be a int').notEmpty().isInt();
            req.checkQuery('name', '"name" can not be empty must be a string').notEmpty().isString();
            req.checkQuery('license', '"license" can not be empty must be a string').notEmpty().isString();
            req.checkQuery('color', '"color" can not be empty must be a string').notEmpty().isString();
            req.checkQuery('age', '"age" can not be empty and must be a int').notEmpty().isInt();
            req.checkQuery('brand', '"brand" can not be empty must be a string').notEmpty().isString();
            req.getValidationResult().then((validationResult) => {
                if (!validationResult.isEmpty()) {
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
    }

    //Param validation for Year to Date
    validateYTD(ytd) {
        router.get('/test_validator', (req, response, next) => {
            req.checkQuery('ytd', '"Year to Date" can not be empty must be Integer').notEmpty().isInt();
            req.getValidationResult().then((validationResult) => {
                if (!validationResult.isEmpty()) {
                    response.json({
                        result: "failed",
                        message: `Validation errors: ${util.inspect(validationResult.array())}`
                    });
                    return;
                }
                //otherwise show
                response.json({
                    result: "ok",
                    message: `Validate input successfully. Input params = ${util.inspect(request.query)}`
                });
            });
        });
    }

    //Param validation for Month to Date
    validateMTD(mtd) {
        router.get('/test_validator', (req, response, next) => {
            req.checkQuery('mtd', '"Month to Date" can not be empty must be Integer').notEmpty().isInt();
            req.getValidationResult().then((validationResult) => {
                if (!validationResult.isEmpty()) {
                    response.json({
                        result: "failed",
                        message: `Validation errors: ${util.inspect(validationResult.array())}`
                    });
                    return;
                }
                //otherwise show
                response.json({
                    result: "ok",
                    message: `Validate input successfully. Input params = ${util.inspect(request.query)}`
                });
            });
        });
    }


    //Param validation for id
    validateID(id) {
        router.get('/test_validator', (req, response, next) => {
            req.checkQuery('id', '"id" can not be empty must be Integer').notEmpty().isInt();
            req.getValidationResult().then((validationResult) => {
                if (!validationResult.isEmpty()) {
                    response.json({
                        result: "failed",
                        message: `Validation errors: ${util.inspect(validationResult.array())}`
                    });
                    return;
                }
                //otherwise show
                response.json({
                    result: "ok",
                    message: `Validate input successfully. Input params = ${util.inspect(request.query)}`
                });
            });
        });
    }


}

module.exports = new paramVal();