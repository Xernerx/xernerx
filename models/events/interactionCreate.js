const { ErrorHandler } = require('../handlers/ErrorHandler.js');
const { Event } = require('../handlers/Event.js');
const { interactionArgs } = require('../../data/Functions.js');

/**
 * @returns interaction command executor.
 */
class BuildInInteractionEvent extends Event {
    constructor() {
        super('interactionCreate', {
            name: 'interactionCreate',
            once: false,
        })
    }

    async run(interaction) {
        if (interaction.isCommand()) {
            if (!interaction.client.interactionCommands.has(interaction.commandName)) return;

            let command = interaction.client.interactionCommands.get(interaction.commandName);

            command.client = interaction.client;

            let group = interactionArgs(interaction).group;

            let sub = interactionArgs(interaction).sub;

            let options = interactionArgs(interaction).options;

            try {
                command.exec(interaction, { group: group, sub: sub, options: options });
            }
            catch (error) {
                console.error(error)
            }
        }
    }
}

module.exports = BuildInInteractionEvent;