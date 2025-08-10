/** @format */

import { Interaction } from 'discord.js';
import { XernerxEventBuilder } from '../build/XernerxEventBuilder.js';
import { XernerxUser } from '../model/XernerxUser.js';
import { XernerxClient } from '../client/XernerxClient.js';
import { XernerxInteractionUtil } from '../util/XernerxInteractionUtil.js';

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

		// args

		await command.exec(
			interaction,
			[
				/*args*/
			],
			command
		);
	}
}
