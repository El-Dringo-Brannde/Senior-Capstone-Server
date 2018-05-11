let mongo = require('./../../database/mongoDB');

let salesAgg = require('./aggregations');
let salesUtility = require('./utility');
let validation = require('./paramValidation');
let compare = require('./compare')
let speechlet = require('./speechlet');

module.exports = class sales extends mongo {
   constructor(mongo, collName, socket) {
      super(mongo, collName, socket);
      this.aggregateBuilder = new salesAgg(mongo, collName, socket);
      this.utility = salesUtility;
      this.validation = validation;
      this.compare = new compare(mongo, 'sales', null);
      this.speechlet = new speechlet();
   }
   /**
    * async cityGroupBy - Return data given just a city
    *
    * @param  {type} city     The city to return data for
    * @param  {type} grouping Method of grouping sales
    * @param  {type} user     UserID of requester
    * @return JSON            Emits JSON result through SocketIO
    */
   async cityGroupBy(city, grouping, user) {
      let barObj = {},
         pieObj = {},
         bubbleObject = {};

      let pieAgg = this.aggregateBuilder.cityPieGroupBy(city, grouping)
      let pieRes = await this.aggregate(pieAgg)
      pieObj = this.utility.arrayToObject(pieRes)
      pieObj.user = user;

      let barAgg = this.aggregateBuilder.cityBarGroupBy(city, grouping)
      let barRes = await this.aggregate(barAgg);
      bubbleObject = JSON.parse(JSON.stringify(barRes)); // deep copy object
      barObj = this.utility.pullGroupToObjectKey(barRes)
      barObj.user = user;

      bubbleObject = this.utility.bubbleLineGroupToObjectKey(bubbleObject);
      bubbleObject.user = user;

      this.emitter(barObj, pieObj, bubbleObject);
      return {
         pieChart: pieObj,
         barChart: barObj,
         bubbleChart: bubbleObject,
         user: user
      }
   }

   /**
    * async stateGroupBy - Return data of a given state
    *
    * @param  {type} state    The state to query for
    * @param  {type} grouping Method of grouping sales
    * @param  {type} user     UserID of requester
    * @return {type}          Emits JSON result through SocketIO
    */
   async stateGroupBy(state, grouping, user) {
      let barObj = {},
         pieObj = {},
         bubbleObject = {};

      let pieAgg = this.aggregateBuilder.statePieGroupBy(state, grouping)
      let pieRes = await this.aggregate(pieAgg)
      pieObj = this.utility.arrayToObject(pieRes)
      pieObj.user = user;

      let barAgg = this.aggregateBuilder.stateBarGroupBy(state, grouping)
      let barRes = await this.aggregate(barAgg)
      bubbleObject = JSON.parse(JSON.stringify(barRes)); // deep copy object
      barObj = this.utility.pullGroupToObjectKey(barRes)
      barObj.user = user;

      bubbleObject = this.utility.bubbleLineGroupToObjectKey(bubbleObject);
      bubbleObject.user = user;

      this.emitter(barObj, pieObj, bubbleObject);
      return {
         pieChart: pieObj,
         barChart: barObj,
         bubbleChart: bubbleObject,
         user: user
      }
   }

   /**
    * async cityStateGroupBy - Return data for a given city, state
    *
    * @param  {type} city  The city to query for
    * @param  {type} state The state to query for
    * @param  {type} group Method of grouping sales
    * @param  {type} user  UserID of requester
    * @return {type}       JSON results returned to client through SocketIO
    */
   async cityStateGroupBy(city, state, group, user) {
      let pieObject = {},
         barObject = {},
         bubbleObject = {};

      let pieAgg = this.aggregateBuilder.cityStatePieGroupBy(city, state, group);
      pieObject = await this.aggregate(pieAgg)
      pieObject = this.utility.arrayToObject(pieObject)
      pieObject.user = user;

      let barAgg = this.aggregateBuilder.cityStateBarGroupBy(city, state, group)
      barObject = await this.aggregate(barAgg);
      bubbleObject = JSON.parse(JSON.stringify(barObject)); // deep copy object

      barObject = this.utility.pullGroupToObjectKey(barObject);
      barObject.user = user;

      bubbleObject = this.utility.bubbleLineGroupToObjectKey(bubbleObject);
      bubbleObject.user = user;

      this.emitter(barObject, pieObject, bubbleObject);
      return {
         pieChart: pieObject,
         barChart: barObject,
         bubbleChart: bubbleObject,
         user: user
      }
   } // ghetto way of doing math NOT in mongoDB

   /**
    * async mapCityStateGroupBy - Build results for viewing on map overlay
    *
    * @param  {type} city  The city to query for
    * @param  {type} state The state to query for
    * @param  {type} group Method of grouping sales
    * @param  {type} name  Name of dealership to view
    * @param  {type} user  UserID of requester
    * @return {type}       SocketIO broadcast of resulting data
    */
   async mapCityStateGroupBy(city, state, group, name, user) {
      let pieObject = {},
         barObject = {},
         bubbleObject = {};

      let pieAgg = this.aggregateBuilder.mapCityStatePieGroupBy(city, state, group, name);
      pieObject = await this.aggregate(pieAgg)
      pieObject = this.utility.arrayToObject(pieObject)
      pieObject.user = user;

      let barAgg = this.aggregateBuilder.mapCityStateBarGroupBy(city, state, group, name)
      barObject = await this.aggregate(barAgg);
      barObject = this.utility.pullGroupToObjectKey(barObject);
      barObject.user = user;

      this.emitter(barObject, pieObject, bubbleObject);
      return {
         pieChart: pieObject,
         barChart: barObject,
         bubbleChart: bubbleObject,
         user: user
      }
   }

   /**
    * changeViewToHome - Handle request to change VR view to home
    *
    * @return {type}  Emits trigger for Unity VR
    */
   changeViewToHome() {
      this.socketIO.socket.emit('home');
   }

   /**
    * async changeViewToMap - Handle request to chagne VR view to map
    *
    * @param  {type} city  City to view on the map
    * @param  {type} state State to view
    * @param  {type} name  Dealership name to view
    * @param  {type} user  UserID of requester
    * @return {type}       Emits request to Unity through SocketIO
    */
   async changeViewToMap(city, state, name, user) {
      let mapAgg = this.aggregateBuilder.mapLatLng(city, state, name)
      let result = await this.aggregate(mapAgg);


      return result
   }

   /**
    * async parseSuggestion - Provide suggestions based on previous request
    *
    * @param  {type} params JSON of previous request, such as city or state
    * @param  {type} query  UserID of requester
    * @return {type}        Verbal response from Alexa
    */
   async parseSuggestion(params, query) {
      if (params.name) {
         let result = await this.mapCityStateGroupBy(params.city, params.state, query.group, params.name, query.userID)
         let cityAvg = await this.compare.avgInCity(params.city, params.state, query.group, params.name)
         let speechResponse = this.speechlet.repeatDealershipSpeechlet(params.city, params.state, params.name, query.group, result);
         speechResponse = this.speechlet.addSimilarStats(cityAvg, speechResponse);
         return {
            data: result,
            speech: speechResponse
         }
      }
      if (params.city) {
         let data = await this.cityStateGroupBy(params.city, params.state, query.group, query.userID);
         let stateAvg = await this.compare.avgInState(params.city, params.state, query.group);
         let speechResponse = this.speechlet.repeatSpeechlet(params.city, params.state, query.group, data);
         speechResponse = this.speechlet.addSimilarStats(stateAvg, speechResponse);
         return {
            data: data,
            speech: speechResponse
         }
      }
      if (params.state) {
         let data = await this.stateGroupBy(params.state, query.group, query.userID);
         let speechResponse = this.speechlet.repeatSpeechlet('', params.state, query.group, data);
         return {
            data: data,
            speech: speechResponse
         }
      }
   }

   /**
    * emitter - Send results to Unity via SocketIO
    *
    * @param  {type} barObj    Results formatted for bar chart
    * @param  {type} pieObj    Results formatted for pie chart
    * @param  {type} bubbleObj Results formatted for bubble chart
    * @return {type}           Emits SocketIO broadcast
    */
   emitter(barObj, pieObj, bubbleObj) {
      this.socketIO.socket.emit('Bar_Chart', barObj);
      this.socketIO.socket.emit('Pie_Chart', pieObj);
      this.socketIO.socket.emit('Bubble_Chart', bubbleObj);
   }
}
