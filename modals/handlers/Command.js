const { CommandHandler } = require('./CommandHandler.js');

class Command extends CommandHandler {
    constructor(id, options = {}) {
        super(id, options)

        /**
         * @param {options} for commands.
         */
        const {
            name = "",
            type = 'message',
            aliases = [],
            description = "",
            detailedDescription = "",
            owner = false,
            admin = false,
            channel = null,
            data = {}
        } = options;

        /**
         * @param {name} the name of the commands
         * @type {String}
         * @required 
         */
        this.name = typeof name == 'string' ? name : console.log(new Error(`Expected name to be a string, got ${typeof name} instead.`))


        /**
         * ! The rest is work in progress.
         */
    }
    exec() {
        /**
         * ! The rest is work in progress.
         */
    }
}

module.exports = { Command };