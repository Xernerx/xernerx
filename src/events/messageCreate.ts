/** @format */

import { XernerxEventBuilder } from '../build/XernerxEventBuilder.js';
import { Events, Message } from 'discord.js';
import XernerxUser from '../model/XernerxUser.js';
import { XernerxClient } from '../main.js';
import { Client } from 'discord.js';

const XernerxMessageCreate = class Class extends XernerxEventBuilder {
	public constructor() {
		super('messageCreate', {
			name: 'messageCreate',
			description: 'An internal xernerx event to make message commands work.',
			type: 'discord',
			emitter: 'client',
			once: false,
			watch: Events.MessageCreate,
		});
	}

	override async run(message: Message) {
		// extenders
		message.author = new XernerxUser(message.client as XernerxClient & Client<true>, message.author);

		console.log(message.author);

		// util
		// validation
		// command
	}
};

export { XernerxMessageCreate };
