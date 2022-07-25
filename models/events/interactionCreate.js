const { Event } = require('../commands/Event.js');
const { interactionArgs, access } = require('./../data/Functions.js');
const Discord = require('discord.js')

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

            if (access(interaction, command)) return;

            try {
                await command.exec(interaction, { group: group, sub: sub, options: options });

                return interaction.client.emit('commandRun', interaction, "interaction", command)
            }
            catch (error) {
                return interaction.client.emit("error", interaction, error);
            }
        }

        if (interaction.isContextMenu()) {
            if (!interaction.client.contextMenuCommands.has(interaction.commandName)) return;

            let command = interaction.client.contextMenuCommands.get(interaction.commandName);

            command.client = interaction.client;

            try {
                await command.exec(interaction);

                return interaction.client.emit('commandRun', interaction, 'contextMenu', command);
            }
            catch (error) {
                return interaction.client.emit("error", interaction, error);
            }
        }
    }
}

module.exports = BuildInInteractionEvent;