const { Event } = require('../commands/Event.js');
const { logStyle } = require('dumfunctions');

/**
 * @returns message command executor.
 */
class BuildInReadyOnceEvent extends Event {
    constructor() {
        super('ready', {
            name: 'ready',
            once: true,
        })
    }

    async run(client) {
        console.log(logStyle(`${client.user.tag} is online in ${(await client.guilds.fetch()).size} server(s).`, "text", "green"))
    }
};

module.exports = BuildInReadyOnceEvent;