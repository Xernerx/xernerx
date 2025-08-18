/** @format */

import { Message } from 'discord.js';
import { XernerxEventBuilder } from '../build/XernerxEventBuilder.js';
import { XernerxUser } from '../model/XernerxUser.js';
import { XernerxMessageUtil } from '../util/XernerxMessageUtil.js';

export class XernerxMessageDeleteEvent extends XernerxEventBuilder {
	constructor() {
		super('XernerxMessageDeleteEvent', {
			name: 'messageDelete',
			emitter: 'client',
			once: false,
		});
	}

	override async run(message: Message) {
		this.client = message.client;

		message.user = new XernerxUser(message.client, message.author);

		message.util = new XernerxMessageUtil(this.client as Message['client'], message);

		if (!this.client.handler.message.handleDeletions) return;

		if (!this.client.cache.messages.has(message.id)) return;

		const id = this.client.cache.messages.get(message.id);

		if (!id) return;

		try {
			const msg = await message.channel.messages.fetch(id);

			await msg.delete();
		} catch (error) {
			await this.client.emit('commandDelete', message, error as Error);
		}
	}
}
