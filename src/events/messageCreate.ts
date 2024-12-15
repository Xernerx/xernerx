/** @format */

import { XernerxEventBuilder } from '../build/XernerxEventBuilder.js';
import { Events, Message } from 'discord.js';

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
		// util
		// validation
		// command
	}
};

export { XernerxMessageCreate };
