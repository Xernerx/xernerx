const { ErrorHandler } = require('../handlers/ErrorHandler.js');
const { Event } = require('../handlers/Event.js');
const { toTitleCase } = require('dumfunctions');

class BuildInInteractionEvent extends Event {
    constructor() {
        super('interactionCreate', {
            name: 'interactionCreate',
            once: false,
        })
    }

    async run(interaction) {
        if (interaction.isCommand()) {
            if (interaction.client.interactionCommands.has(interaction.commandName)) {
                let command = interaction.client.interactionCommands.get(interaction.commandName);
                command.client = interaction.client;
                let group, sub, options = {};

                if (interaction?.options?._group) group = interaction.options._group;

                if (interaction?.options?._subcommand) sub = interaction.options._subcommand;

                if (interaction?.options?._hoistedOptions) {
                    for (const option of interaction.options._hoistedOptions) {
                        options[option.name] = option.value;
                    }
                }

                try {
                    command.exec(interaction, { group: group, sub: sub, options: options });
                }
                catch (error) {
                    new ErrorHandler({ error: error });
                }
            }
        }
    }
}

module.exports = BuildInInteractionEvent;