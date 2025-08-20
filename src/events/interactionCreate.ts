/** @format */

import { AutocompleteInteraction, ChatInputCommandInteraction, Interaction } from 'discord.js';
import { XernerxEventBuilder } from '../build/XernerxEventBuilder.js';
import { XernerxUser } from '../model/XernerxUser.js';
import { XernerxClient } from '../client/XernerxClient.js';
import { XernerxInteractionUtil } from '../util/XernerxInteractionUtil.js';
import { XernerxInteractionArguments } from '../model/XernerxInteractionArguments.js';

export class XernerxInteractionCreateEvent extends XernerxEventBuilder {
	constructor() {
		super('XernerxInteractionCreateEvent', {
			name: 'interactionCreate',
			emitter: 'client',
			once: false,
		});
	}

	override async run(interaction: Interaction) {
		this.client = interaction.client as XernerxClient;

		interaction.user = new XernerxUser(interaction.client, interaction.user);

		interaction.util = new XernerxInteractionUtil(this.client as Interaction['client'], interaction);

		if (!interaction.isCommand()) return;

		const command = this.client.commands.slash.get(interaction.commandName);

		if (!command) return;

		// validation

		// inhibitors

		new Promise(async (resolve) => {
			if (interaction.isAutocomplete()) {
				const focused = (interaction as AutocompleteInteraction).options.getFocused(true);
				const options = (interaction as AutocompleteInteraction).options;

				await command.autocomplete(interaction, focused, options);
			} else resolve(true);
		}).then(async () => {
			const args = new XernerxInteractionArguments(interaction as ChatInputCommandInteraction, command);
			const options = { options: args.options(), subcommand: args.subcommand(), group: args.subcommand() };

			try {
				await interaction.client.emit('commandStart', interaction, options, command);

				await command.exec(interaction, options, command);

				await interaction.client.emit('commandFinish', interaction, options, command);
			} catch (error) {
				await interaction.client.emit('commandError', interaction, options, command, error as Error);
			}
		});
	}
}
