var expressValidator = require('express-validator');
let util = require('util');

class paramVal {
    constructor() {
    }
    // Test for Express-validator
    validateStateCity(state, city) {
        router.get('/test_validator', (req, response, next) => {
            req.checkQuery('state', '"State" can not be empty and must be a string').notEmpty().isString();
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
                    messsage: `Validate input successfully. Input params = ${util.inspect(request.query)}`
                });
            });
        });
    }
}

module.exports = new paramVal();