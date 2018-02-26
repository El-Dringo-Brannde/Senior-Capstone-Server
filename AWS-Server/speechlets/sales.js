let utility = require('./../utility/sales');
let _ = require('lodash')
module.exports = class salesSpeechlet {
    constructor() { }


    repeatSpeechlet(city = '', state = '', grouping, data) {
        if (_.isEmpty(data.pieChart) && _.isEmpty(data.barChart))
            return `It looks like we don't have any data for that place.`

        let speechlet = `Ok, I grouped sales by ${grouping} in ${city}, ${state}.`;
        let highest = utility.findHighestNumbers(data);
        let lowest = utility.findLowestNumbers(data);

        speechlet += `The highest selling ${grouping} was ${highest[0]} which made ${parseInt(highest[1])} dollars. `;
        speechlet += `While the lowest selling ${grouping} was ${lowest[0]} with ${parseInt(lowest[1])} dollars.`;
        return speechlet;
    }

    repeatDealershipSpeechlet(city = '', state = '', name = '', grouping, data) {
        if (_.isEmpty(data.pieChart) && _.isEmpty(data.barChart))
            return `It looks like we don't have any data for that place.`

        let speechlet = `Ok, I grouped sales by ${grouping} for ${name} in ${city}, ${state}.`;
        let highest = utility.findHighestNumbers(data);
        let lowest = utility.findLowestNumbers(data);

        speechlet += `The highest selling ${grouping} was ${highest[0]} which made ${parseInt(highest[1])} dollars. `;
        speechlet += `While the lowest selling ${grouping} was ${lowest[0]} with ${parseInt(lowest[1])} dollars.`;
        return speechlet;
    }
}