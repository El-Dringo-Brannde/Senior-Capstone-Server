var crud = require('./../database/CRUD');

module.exports = class sales extends crud {
    constructor(mongo, collName, socket) {
        super(mongo, collName, socket);
    }

    parseRequest(query, res) {
        var searchObj = {
            brands: query.type
        }
        this.read(searchObj, res);
    }


};