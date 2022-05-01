class ErrorHandler {
    contructor(error) {
        this.error = error;
    }

    throw(error) {
        /*
        * For custom error handling:
        * class CustomErrorHandler extends ErrorHandler {
        *    throw(error) {
        *       channel send or whatever
        *   }
        * }
        * client.errorHandler = new ErrorHandler(); // or you can do whatever you want to make this fit the style
        */
    }
}

module.exports = { ErrorHandler };