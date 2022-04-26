const { ErrorHandler } = require("./ErrorHandler.js");

class Error {
    constructor(error) {
        this.error = error
    }

    throw(error) {
        console.log(error)
    }
}

module.exports = { Error };