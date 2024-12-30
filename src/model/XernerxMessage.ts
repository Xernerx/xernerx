/** @format */

import { Message } from 'discord.js';
import { XernerxClient } from '../main.js';
import { MessageUtil } from '../util/MessageUtil.js';
import XernerxUser from './XernerxUser.js';

export class XernerxMessage {
	declare public readonly message;
	declare public readonly client;
	declare public readonly util;
	declare public readonly user;
	declare public readonly author;

	constructor(message: Message) {
		this.message = message;

		this.client = message.client as XernerxClient;

		this.util = new MessageUtil(this.client, message);

		this.user = new XernerxUser(this.client as any, message);
		this.author = new XernerxUser(this.client as any, message);
	}
}
