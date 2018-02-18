let salesAgg = require('./../aggregations/sales');
let mongo = require('./../database/mongoDB');
let salesUtility = require('./../utility/sales');
let validation = require('./../paramValidation/sales');

module.exports = class sales extends mongo {
    constructor(mongo, collName, socket) {
        super(mongo, collName, socket);
        this.aggregateBuilder = new salesAgg(mongo, collName, socket);
        this.utility = salesUtility;
        this.validation = validation;
    }

    async cityGroupBy(city, grouping, user) {
        let barObj = {}, pieObj = {}, bubbleObject = {};

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

        return {
            pieChart: pieObj,
            barChart: barObj,
            bubbleChart: bubbleObject,
            user: user
        }
        this.emitter(barObj, pieObj, bubbleObject);
    }

    async stateGroupBy(state, grouping, user) {
        let barObj = {}, pieObj = {}, bubbleObject = {};

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

        return {
            pieChart: pieObj,
            barChart: barObj,
            bubbleChart: bubbleObject,
            user: user
        }
        this.emitter(barObj, pieObj, bubbleObject);
    }

    async cityStateGroupBy(city, state, group, user) {
        let pieObject = {}, barObject = {}, bubbleObject = {};

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

        return {
            pieChart: pieObject,
            barChart: barObject,
            bubbleChart: bubbleObject,
            user: user
        }
        this.emitter(barObject, pieObject, bubbleObject);
    } // ghetto way of doing math NOT in mongoDB

    changeViewToHome() {
        this.socketIO.socket.emit('home');
    }

    changeViewToMap() {
        this.socketIO.socket.emit('map');
    }

    emitter(barObj, pieObj, bubbleObj) {
        this.socketIO.socket.emit('Bar_Chart', barObj);
        this.socketIO.socket.emit('Pie_Chart', pieObj);
        this.socketIO.socket.emit('Bubble_Chart', bubbleObj);
    }
}