/** @format */

import { ChatInputCommandInteraction, Interaction } from 'discord.js';
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

		// autocomplete

		const args = new XernerxInteractionArguments(interaction as ChatInputCommandInteraction, command);

		await command.exec(interaction, { options: args.options(), subcommand: args.subcommand(), group: args.subcommand() }, command);
	}
}
