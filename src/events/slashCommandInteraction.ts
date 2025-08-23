/** @format */

import { AutocompleteInteraction, ChatInputCommandInteraction } from 'discord.js';
import { XernerxEventBuilder } from '../build/XernerxEventBuilder.js';
import { XernerxInteractionArguments } from '../model/XernerxInteractionArguments.js';
import { XernerxSlashCommandValidator } from '../validators/XernerxSlashCommandValidator.js';

export class XernerxSlashCommandInteractionEvent extends XernerxEventBuilder {
	constructor() {
		super('XernerxSlashCommandInteractionEvent', {
			name: 'slashCommandInteraction',
			emitter: 'client',
			once: false,
		});
	}

	override async run(interaction: ChatInputCommandInteraction) {
		const command = interaction.client.commands.slash.get(interaction.commandName);

		if (!command) return;

		// inhibitors

		new Promise(async (resolve) => {
			if (interaction.isAutocomplete()) {
				const focused = (interaction as AutocompleteInteraction).options.getFocused(true);
				const options = (interaction as AutocompleteInteraction).options;

				await command.autocomplete({ interaction, focused, options });
			} else resolve(true);
		}).then(async () => {
			const args = new XernerxInteractionArguments(interaction as ChatInputCommandInteraction, command);
			const options = { options: args.options(), subcommand: args.subcommand(), group: args.subcommand() };

			try {
				await interaction.client.emit('commandStart', interaction, options, command);

				const validation = new XernerxSlashCommandValidator(interaction, command);

				if (!validation.validate()) return;

				if (command.defer) await interaction.deferReply();

				if (await command.conditions({ interaction, ...options, command })) return;

				await command.exec({ interaction, ...options, command });

				await interaction.client.emit('commandFinish', interaction, options, command);
			} catch (error) {
				await interaction.client.emit('commandError', interaction, options, command, error as Error);
			}
		});
	}
}
