/** @format */

import { XernerxEventBuilder } from '../build/XernerxEventBuilder.js';
import { Events, Interaction } from 'discord.js';
import XernerxUser from '../model/XernerxUser.js';
import { XernerxClient } from '../main.js';
import { Client } from 'discord.js';

import { InteractionUtil } from '../util/InteractionUtil.js';

const XernerxInteractionCreate = class Class extends XernerxEventBuilder {
	declare public readonly util: InteractionUtil;
	declare public readonly user: XernerxUser;

	public constructor() {
		super('interactionCreate', {
			name: 'interactionCreate',
			description: 'An internal xernerx event to make interaction commands work.',
			type: 'discord',
			emitter: 'client',
			once: false,
			watch: Events.InteractionCreate,
		});
	}

	override async run(interaction: Interaction & { user: XernerxUser; author: XernerxUser; util: InteractionUtil }) {
		// extenders
		interaction.user = new XernerxUser(interaction.client as XernerxClient & Client<true>, interaction.author);

		interaction.author = new XernerxUser(interaction.client as XernerxClient & Client<true>, interaction.author);

		// util

		interaction.util = new InteractionUtil(interaction.client as XernerxClient, interaction);
		// validation

		// command
	}
};

export { XernerxInteractionCreate };
