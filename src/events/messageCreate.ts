/** @format */

import { XernerxEventBuilder } from '../build/XernerxEventBuilder.js';
import { Events, Message } from 'discord.js';
import XernerxUser from '../model/XernerxUser.js';
import { XernerxClient, XernerxMessage, XernerxMessageCommandBuilder } from '../main.js';
import { Client } from 'discord.js';

import { MessageUtil } from '../util/MessageUtil.js';

const XernerxMessageCreate = class Class extends XernerxEventBuilder {
	declare public readonly util: MessageUtil;
	declare public readonly user: XernerxUser;

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

	override async run(message: Message & { user: XernerxUser; author: XernerxUser; util: MessageUtil }) {
		// extenders
		message.user = new XernerxUser(message.client as XernerxClient & Client<true>, message.author);

		message.author = new XernerxUser(message.client as XernerxClient & Client<true>, message.author);

		// util

		message.util = new MessageUtil(message.client as XernerxClient, message);
		// validation

		// command

		const args = message.content.split(' ');

		const command = args.slice()[0];

		let trigger: XernerxMessageCommandBuilder | null = null;

		const parsed: { prefix: null | string; alias: null | string } = {
			prefix: null,
			alias: null,
		};

		this.client.collections.commands.message.map((cmd) => {
			const prefix = [
				...(typeof this.client.modules.options.commands.message?.prefix === 'string'
					? [this.client.modules.options.commands.message?.prefix]
					: (this.client.modules.options.commands.message?.prefix as Array<string>)),
				...cmd.prefix,
			];

			for (const pre of prefix) {
				if (!command.startsWith(pre)) continue;

				parsed.prefix = pre;
				break;
			}
		});

		if (!parsed.prefix) return;

		this.client.collections.commands.message.map((cmd) => {
			const alias = [cmd.name, ...(typeof cmd.aliases === 'string' ? [cmd.aliases] : cmd.aliases)];

			for (const ali of alias) {
				if (command.replace(parsed.prefix as string, '') !== ali) continue;

				parsed.alias = ali;

				trigger = cmd;
				break;
			}
		});

		if (trigger && parsed.prefix) {
			(trigger as XernerxMessageCommandBuilder).exec(message as unknown as XernerxMessage);
		}
	}
};

export { XernerxMessageCreate };
