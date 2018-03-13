let utility = require('./../utility/sales');
let _ = require('lodash')
module.exports = class salesSpeechlet {
   constructor() { }

   repeatSpeechlet(city = '', state = '', grouping, data) {
      if (_.isEmpty(data.pieChart) && _.isEmpty(data.barChart))
         return `It looks like we don't have any data for that place.`

      let speechlet = `I grouped sales by ${grouping} in ${city}, ${state}.`;
      let highest = utility.findHighestNumbers(data);
      let lowest = utility.findLowestNumbers(data);

      speechlet +=
         `The highest selling ${grouping} was ${highest[0]} with ${parseInt(highest[1])} dollars, `;
      speechlet += `and the lowest was ${lowest[0]} with ${parseInt(lowest[1])}.`;
      return speechlet;
   }

   repeatDealershipSpeechlet(city = '', state = '', name = '', grouping, data) {
      if (_.isEmpty(data.pieChart) && _.isEmpty(data.barChart))
         return `It looks like we don't have any data for that place.`

      let speechlet = `I grouped sales by ${grouping} for ${name} in ${city}, ${state}.`;
      let highest = utility.findHighestNumbers(data);
      let lowest = utility.findLowestNumbers(data);

      speechlet +=
         `The highest selling ${grouping} was ${highest[0]} with ${parseInt(highest[1])}. `;
      speechlet += `While the lowest was ${lowest[0]} with ${parseInt(lowest[1])}.`;
      return speechlet;
   }

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
