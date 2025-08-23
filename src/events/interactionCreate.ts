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

		if (interaction.isChatInputCommand()) return await interaction.client.emit('slashCommandInteraction', interaction);

		if (interaction.isContextMenuCommand()) return await interaction.client.emit('contextCommandInteraction', interaction);

		if (interaction.isAnySelectMenu()) return await interaction.client.emit('selectMenuInteraction', interaction);

		if (interaction.isButton()) return await interaction.client.emit('buttonInteraction', interaction);

		if (interaction.isModalSubmit()) return await interaction.client.emit('modalInteraction', interaction);
	}
}
