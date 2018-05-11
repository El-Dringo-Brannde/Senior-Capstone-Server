let utility = require('./utility');
let _ = require('lodash')
module.exports = class salesSpeechlet {
   constructor() { }

   /**
    * repeatSpeechlet - If a prompt doesn't get a response from the user
    * reprompt them
    *
    * @param  {type} city = ''  City that was requested, empty if none
    * @param  {type} state = '' State that was requested, empty if none
    * @param  {type} grouping   How sales were grouped
    * @param  {type} data       The data that was returned
    * @return {type}            Speechlet for Alexa to say
    */
   repeatSpeechlet(city = '', state = '', grouping, data) {
      if (_.isEmpty(data.pieChart) && _.isEmpty(data.barChart))
         return `It looks like we don't have any data for that place.`

      let speechlet = `I grouped sales by ${grouping} in ${city}, ${state}. `;
      let highest = utility.findHighestNumbers(data);
      let lowest = utility.findLowestNumbers(data);

      speechlet +=
         `The highest selling ${grouping} was ${highest[0]} with ${parseInt(highest[1])} dollars, `;
      speechlet += `and the lowest was ${lowest[0]} with ${parseInt(lowest[1])}.`;
      return speechlet;
   }

   /**
    * repeatDealershipSpeechlet - If a prompt doesn't get a response from the user
    * reprompt them
    *
    * @param  {type} city = ''  City that was requested, empty if none
    * @param  {type} state = '' State that was requested, empty if none
    * @param  {type} grouping   How sales were grouped
    * @param  {type} data       The data that was returned
    * @return {type}            Speechlet for Alexa to say
    */
   repeatDealershipSpeechlet(city = '', state = '', name = '', grouping, data) {
      if (_.isEmpty(data.pieChart) && _.isEmpty(data.barChart))
         return `It looks like we don't have any data for that place.`

      let speechlet = `I grouped sales by ${grouping} for ${name} in ${city}, ${state}. `;
      let highest = utility.findHighestNumbers(data);
      let lowest = utility.findLowestNumbers(data);

      speechlet +=
         `The highest selling ${grouping} was ${highest[0]} with ${parseInt(highest[1])}. `;
      speechlet += `While the lowest was ${lowest[0]} with ${parseInt(lowest[1])}.`;
      return speechlet;
   }

   /**
    * addSimilarStats - Add statistics for similar requests to the speechlet
    *
    * @param  {type} similarStatsObj Data returned that is similar to requested
    * @param  {type} speechResponse  Currently pending speechlet
    * @return {type}                 Speechlet for Alexa to say
    */
   addSimilarStats(similarStatsObj, speechResponse) {
      speechResponse += ' Comparitively, the regional average for the same high and low is ';
      for (const highLow in similarStatsObj) {
         for (const brand in similarStatsObj[highLow]) {
            speechResponse += `${brand} with ${parseInt(similarStatsObj[highLow][brand])} and `
         }
      }
      speechResponse = speechResponse.split(' ')
      speechResponse.pop()
      speechResponse.pop()
      speechResponse = speechResponse.join(' ')
      speechResponse += '.'
      return speechResponse
   }

   /**
    * addSuggestion - Add a suggestion for further requests to the current
    * speechlet
    *
    * @param  {type} suggestion     Suggestion text to add
    * @param  {type} speechResponse Currently pending speechlet
    * @return {type}                Speechlet for Alexa to say
    */
   addSuggestion(suggestion, speechResponse) { //getting sloppy..
      let params = suggestion.params
      let smashParams = ''
      if (params.name)
         smashParams += `${params.name} for `
      if (params.city)
         smashParams += `${params.city}, `
      smashParams += `${params.state}`

      speechResponse += ` Would you like to see sales by ${suggestion.query.group} in ${smashParams}?`
      return speechResponse
   }
}
