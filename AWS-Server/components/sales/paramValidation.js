var router = require('express')
   .Router();
var {
   check,
   validationResult
} = require('express-validator/check');
let util = require('util');

class salesValidator {
   constructor() { }

   /**
    * checkResult - Check for errors in a request
    *
    * @param  {type} req Given request to check
    * @param  {type} res Result of check(s)
    * @return {type}     Null if no errors, or error speechlet for Alexa
    */
   checkResult(req, res) {
      let errors = validationResult(req)
      if (!errors.isEmpty())
         res.json({
            error: errors.mapped(),
            speechlet: `I'm sorry, there was an error in your query.`
         })
   }

   /**
    * nameCityState - Check city, state, and dealership request have valid
    * components
    *
    * @return {type}
    * If no errors - Null
    * Else - Error encountered
    */
   nameCityState() {
      return [
         check('city')
            .exists()
            .isAlpha(),
         check('state')
            .exists()
            .isAlpha(),
         check('name')
            .exists()
            .isIn([
               'bobs buggy',
               'toms toys',
               'chris cars',
               'jeffs junkers',
               'harrys hatchbacks',
               'chads clunkers',
               'jims jalopys'
            ]),
         check('userID')
            .isAscii()
            .exists()
      ]
   }

   /**
    * nameGroupCityState - Check city, state, grouping, and dealership request have valid
    * components
    *
    * @return {type}
    * If no errors - Null
    * Else - Error encountered
    */
   nameGroupCityState() {
      return [
         check('city')
            .exists()
            .isAlpha(),
         check('state')
            .exists()
            .isAlpha(),
         check('group')
            .exists()
            .isAlpha(),
         check('name')
            .exists()
            .isIn([
               'bobs buggy',
               'toms toys',
               'chris cars',
               'jeffs junkers',
               'harrys hatchbacks',
               'chads clunkers',
               'jims jalopys'
            ]),
         check('userID')
            .isAscii()
            .exists()
      ]
   }

   /**
    * state - Check that state request has valid components
    *
    * @return {type}
    * If no errors - Null
    * Else - Error encountered
    */
   state() {
      return [
         check('state')
            .exists()
            .isAlpha(),
         check('group')
            .isIn(['color', 'name', 'age', 'model', 'brand', 'price', 'date', 'license'])
            .exists(),
         check('userID')
            .isAscii()
            .exists()
      ] // check against US state array
   }

   /**
    * city - Check that city request has valid components
    *
    * @return {type}
    * If no errors - Null
    * Else - Error encountered
    */
   city() {
      return [
         check('city')
            .exists()
            .isAlpha(),
         check('group')
            .isIn(['color', 'name', 'age', 'model', 'brand', 'price', 'date', 'license'])
            .exists(),
         check('userID')
            .isAscii()
            .exists()
      ] // check against US state array
   }

   /**
    * cityState - Check that city, state request has valid components
    *
    * @return {type}
    * If no errors - Null
    * Else - Error encountered
    */
   cityState() {
      return [
         check('city')
            .exists()
            .isAlpha(),
         check('state')
            .exists()
            .isAlpha(),
         check('group')
            .isIn(['color', 'name', 'age', 'model', 'brand', 'price', 'date', 'license'])
            .exists(),
         check('userID')
            .isAscii()
            .exists()
      ] // check against US state array
   }
}

module.exports = new salesValidator();
