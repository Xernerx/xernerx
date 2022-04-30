const { Error } = require("../handlers/Error.js");
const { Event } = require('../handlers/Event.js');

/**
 * @returns message update command executor.
 */
class BuildInMessageUpdateEvent extends Event {
    constructor() {
        super('messageUpdate', {
            name: 'messageUpdate',
            once: false,
        })
    }

    async run(message) {
        console.log(this.ranCommands)
    }
};

module.exports = BuildInMessageUpdateEvent;