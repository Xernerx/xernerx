/** @format */

import { Message } from 'discord.js';
import { XernerxEventBuilder } from '../build/XernerxEventBuilder.js';
import { XernerxUser } from '../model/XernerxUser.js';
import { XernerxMessageUtil } from '../util/XernerxMessageUtil.js';
import { XernerxError } from '../tools/XernerxError.js';

export class XernerxMessageUpdateEvent extends XernerxEventBuilder {
	constructor() {
		super('XernerxMessageUpdateEvent', {
			name: 'messageUpdate',
			emitter: 'client',
			once: false,
		});
	}

	override async run(oldMessage: Message, message: Message) {
		this.client = message.client;

		message.user = new XernerxUser(message.client, message.author);

		message.util = new XernerxMessageUtil(this.client as Message['client'], message);

		if (!message.content) return;
		if (this.client.handler.message.ignore?.bots && message.author.bot) return;
		if (this.client.handler.message.ignore?.self && message.author.id === this.client.user?.id) return;
		if (this.client.handler.message.ignore?.system && message.system) return;

		if (!message.util.parsed.command) return;

		const command = this.client.commands.message.get(message.util.parsed.command);

		if (
			this.client.handler.message.mention &&
			!message.util.parsed.mention &&
			!command?.prefix.includes(message.util.parsed.prefix as string) &&
			!this.client.handler.message.prefix?.includes(message.util.parsed.prefix as string)
		)
			return;

		// validation

		// args

		// inhibitors

		try {
			await command?.exec(message, message.util.args);
		} catch (error) {
			new XernerxError((error as Error).message);
		}
	}
}
