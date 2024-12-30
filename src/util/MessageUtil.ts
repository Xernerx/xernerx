/** @format */

import { XernerxClient } from '../client/XernerxClient.js';
import { Util } from './Util.js';
import { ChannelType, MessagePayload, MessageReplyOptions, Message } from 'discord.js';

export class MessageUtil extends Util {
	declare public readonly message;

	constructor(client: XernerxClient, message: Message) {
		super(client);

		this.message = message;
	}

	reply(options: string | MessagePayload | MessageReplyOptions) {
		this.message.reply(options);
	}

	send(options: string | MessagePayload | MessageReplyOptions) {
		if (this.message.channel.type == ChannelType.GroupDM) return;

		this.message.channel.send(options);
	}
}
