module.exports = class suggestion {
   constructor() {
   }

   randomSuggestion(lastQuery) {
      let logObj = { query: lastQuery, time: new Date() }
      let TF = parseInt(Math.random() * 10 + 1) % 2

      if (TF == false && lastQuery.params.city)
         logObj.suggestion = this.regionalSuggestion(lastQuery)
      else
         logObj.suggestion = this.flipGroup(lastQuery)


      return logObj
   } // this is bad.. but atleast it offers suggestions

   flipGroup(lastQuery) {
      let suggestionQuery = JSON.parse(JSON.stringify(lastQuery))
      if (suggestionQuery.query.group == 'color')
         suggestionQuery.query.group = 'brand'
      else
         suggestionQuery.query.group = 'color'
      return suggestionQuery
   } // need to de-hard code this in the future for more groups.

   createSuggestion(lastQuery) {
      return this.randomSuggestion(lastQuery)
   }

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