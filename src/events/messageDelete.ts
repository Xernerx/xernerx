/** @format */

import { Message } from 'discord.js';

import { EventBuilder } from '../build/EventBuilder.js';
import { XernerxUser } from '../model/XernerxUser.js';
import { MessageUtil } from '../util/MessageUtil.js';

export class XernerxMessageDeleteEvent extends EventBuilder {
	constructor() {
		super('XernerxMessageDeleteEvent', {
			name: 'messageDelete',
			emitter: 'client',
			once: false,
		});
	}

	override async run(message: Message) {
		message.user = new XernerxUser(message.client, message.author);

		message.util = new MessageUtil(this.client as Message['client'], message);

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
