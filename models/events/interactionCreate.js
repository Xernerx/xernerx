const { Event } = require('../commands/Event.js');
const { interactionArgs } = require('./../utils/Arguments.js');
const { InteractionType } = require('discord.js')
const { commandValidation } = require('./../utils/CommandValidation.js');
const { interactionUtil } = require('./../utils/Util.js');
const { inhibitorsValidation } = require('../utils/InhibitorsValidation.js');
/**
 * @returns interaction command executor.
 */
class BuildInInteractionEvent extends Event {
    constructor() {
        super('interactionCreate', {
            name: 'interactionCreate',
            type: 'client',
            once: false,
        })
    }

    async run(interaction) {
        await interactionUtil(interaction);

        if (interaction.type == InteractionType.ApplicationCommand) {
            if (interaction.client.commands.interaction.has(interaction.commandName)) {
                let command = interaction.client.commands.interaction.get(interaction.commandName);

                if (await inhibitorsValidation(interaction, command)) return;

                await this.defer(interaction, command);

                command.client = interaction.client;

                const group = interactionArgs(interaction).group;

                const subcommand = interactionArgs(interaction).sub;

                const args = interactionArgs(interaction).options;

                if (commandValidation(interaction, command)) return;

                try {
                    if (command.conditions && await command.conditions(interaction, { group, subcommand, args })) return;

                    await command.exec(interaction, { group, subcommand, args });

                    return interaction.client.emit('commandRun', interaction, "interaction", command)
                }
                catch (error) {
                    return interaction.client.emit("error", interaction, error);
                }
            }

            if (interaction.client.commands.contextMenu.has(interaction.commandName)) {
                let command = interaction.client.commands.contextMenu.get(interaction.commandName);

                if (await inhibitorsValidation(interaction, command)) return;

                await this.defer(interaction, command);

                command.client = interaction.client;

                try {
                    if (command.conditions && await command.conditions(interaction)) return;

                    await command.exec(interaction);

                    return interaction.client.emit('commandRun', interaction, 'contextMenu', command);
                }
                catch (error) {
                    return interaction.client.emit("error", interaction, error);
                }
            }
        }
    }

    async defer(interaction, command) {
        if (command?.defer?.reply) return await interaction.deferReply({ ephemeral: command?.defer?.ephemeral });

        else if (command?.defer?.reply === false && interaction.client?.settings?.defer?.reply) return;

        else if (interaction.client?.settings?.defer?.reply) return await interaction.deferReply({ ephemeral: interaction.client?.settings?.defer?.ephemeral || command?.defer?.ephemeral });
    }
}

module.exports = BuildInInteractionEvent;