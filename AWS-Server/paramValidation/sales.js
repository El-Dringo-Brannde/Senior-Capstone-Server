var router = require('express')
   .Router();
var {
   check,
   validationResult
} = require('express-validator/check');
let util = require('util');

class salesValidator {
   constructor() {}

   checkResult(req, res) {
      let errors = validationResult(req)
      if (!errors.isEmpty())
         res.json({
            error: errors.mapped()
         })
   }

   //Param Validation for state
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

   //Param Validation for city
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

   //Param validation for city & state
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
