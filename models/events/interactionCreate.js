const { Event } = require('../commands/Event.js');
const { interactionArgs } = require('./../data/Functions.js');
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

            if (command.owner && !interaction.client.ownerId.includes(interaction.user.id)) return interaction.client.emit('commandBlocked', interaction, "missing ownership")

            if (command.admin && !interaction.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return interaction.client.emit('commandBlocked', interaction, "missing admin permission")

            try {
                await command.exec(interaction, { group: group, sub: sub, options: options });
            }
            catch (error) {
                return interaction.client.emit("error", interaction, error);
            }
        }
    }
}

module.exports = BuildInInteractionEvent;