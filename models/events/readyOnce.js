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
        if (client.logging) console.log(logStyle(`${client.user.tag} is online in ${(await client.guilds.fetch()).size} server(s).`, "text", "green"))

        if (client.settings.logging) {
            let loaded = [];

            for (const [type, commands] of Object.entries(client.commands)) {
                for (let [id, command] of commands) {
                    command.name = command?.data?.name || command?.aliases[0] || command.id;

                    command.description = command?.data?.description || command.description;

                    command.runType = type;

                    if (!loaded.includes(command)) loaded.push(command);
                }
            }
            for (const [id, event] of [...client.events]) {
                event.runType = 'event'

                loaded.push(event)
            }

            console.table(loaded, client.settings.logging);
        }
    }
};

module.exports = BuildInReadyOnceEvent;