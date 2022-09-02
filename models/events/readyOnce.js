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
        if (client.settings.logging) console.info(logStyle(`${client.user.tag} is online in ${(await client.guilds.fetch()).size} servers.`, "text", "cyan"));

        if (Array.isArray(client.settings.logging)) {
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
                event.runType = 'event';

                loaded.push(event);
            }

            for (const [id, inhibitor] of [...client.inhibitors]) {
                inhibitor.runType = 'inhibitor';

                loaded.push(inhibitor);
            }

            console.table(loaded, client.settings.logging);
        }
        else {
            Object.entries(client.commands).map(([type, commands]) => {
                console.info(logStyle(`Loaded ${type} commands: ${commands.map(command => command?.data?.name || command?.name || command?.id).join(', ')}`, "text", "cyan"));
            })

            // add events and inhibitors;
        }
    }

};

module.exports = BuildInReadyOnceEvent;