const { ErrorHandler } = require('../handlers/ErrorHandler.js');
const { Event } = require('../handlers/Event.js');

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
                try {
                    command.exec(interaction);
                }
                catch (error) {
                    new ErrorHandler({ error: error });
                }
            }
        }
    }
}

module.exports = BuildInInteractionEvent;