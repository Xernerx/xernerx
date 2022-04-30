class ErrorHandler {
    contructor(id, { error: error }) {
        this.error = error;
    }

    exec(error) {
        /*
        * For custom error handling:
        * class CustomErrorHandler extends ErrorHandler {
        *    exec(error) {
        *       channel send or whatever
        *   }
        * }
        * client.errorHandler = new ErrorHandler(); // or you can do whatever you want to make this fit the style
        */
    }
}

module.exports = { ErrorHandler };