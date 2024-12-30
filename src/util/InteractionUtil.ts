/** @format */

import { XernerxClient } from '../client/XernerxClient.js';
import { Util } from './Util.js';
import { MessagePayload, MessageReplyOptions, Interaction } from 'discord.js';

export class InteractionUtil extends Util {
	declare public readonly interaction;

	constructor(client: XernerxClient, interaction: Interaction) {
		super(client);

		this.interaction = interaction;
	}

	reply(options: string | MessagePayload | MessageReplyOptions) {
		return;
	}

	send(options: string | MessagePayload | MessageReplyOptions) {
		return;
	}
}
