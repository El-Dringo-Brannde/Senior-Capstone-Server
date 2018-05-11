/**
 * This module is for providing a suggestion based on a user's request
 */
module.exports = class suggestion {
   constructor() {
   }

   /**
    * randomSuggestion - Randomly decide what method to use for making a
    * suggestion   
    *
    * @param  {type} lastQuery JSON object of previous request
    * @return {type}           Suggestion to make to user
    */
   randomSuggestion(lastQuery) {
      let logObj = { query: lastQuery, time: new Date() }
      let TF = parseInt(Math.random() * 10 + 1) % 2

      if (TF == false && lastQuery.params.city)
         logObj.suggestion = this.regionalSuggestion(lastQuery)
      else
         logObj.suggestion = this.flipGroup(lastQuery)


      return logObj
   }

   /**
    * flipGroup - Suggest flipping the group
    *
    *
    * @param  {type} lastQuery JSON object of previous request
    * @return {type}           Suggestion to make to user
    */
   flipGroup(lastQuery) {
      let suggestionQuery = JSON.parse(JSON.stringify(lastQuery))
      if (suggestionQuery.query.group == 'color')
         suggestionQuery.query.group = 'brand'
      else
         suggestionQuery.query.group = 'color'
      return suggestionQuery
   }

   createSuggestion(lastQuery) {
      return this.randomSuggestion(lastQuery)
   }

   /**
    * regionalSuggestion - Suggest zooming out a level
    * e.g. Suggest requesting Oregon after requesting Portland, Oregon
    *
    * @param  {type} lastQuery JSON object of previous request
    * @return {type}           Suggestion to make to user
    */
   regionalSuggestion(lastQuery) {
      let suggestionQuery = JSON.parse(JSON.stringify(lastQuery))
      if (suggestionQuery.params.name) {
         delete suggestionQuery.params.name
         return suggestionQuery
      }
      if (suggestionQuery.params.city) {
         delete suggestionQuery.params.city
         return suggestionQuery
      }
   }
}
