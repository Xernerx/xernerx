/** @format */

import sharpyy from 'sharpyy';
import { z } from 'zod';

import { XernerxClient } from '../client/XernerxClient.js';
import { Handler } from './Handler.js';
import { XernerxMessageCreateEvent } from '../events/messageCreate.js';
import { XernerxMessageUpdateEvent } from '../events/messageUpdate.js';
import { XernerxMessageDeleteEvent } from '../events/messageDelete.js';
import { XernerxInteractionCreateEvent } from '../events/interactionCreate.js';
import { XernerxSuccess } from '../tools/XernerxSuccess.js';
import { XernerxWarn } from '../tools/XernerxWarn.js';
import { XernerxError } from '../tools/XernerxError.js';
import { XernerxMessageCommandHandlerOptions } from '../interfaces/XernerxMessageCommandHandlerOptions.js';
import { XernerxSlashCommandHandlerOptions } from '../interfaces/XernerxSlashCommandHandlerOptions.js';
import { XernerxEventBuilder } from '../build/XernerxEventBuilder.js';
import { XernerxReadyEvent } from '../events/ready.js';

export class CommandHandler extends Handler {
	constructor(client: XernerxClient) {
		super(client);
	}

	public async loadMessageCommand(file: string) {
		return await this.loadFile(file);
	}

	public async loadMessageCommands(options: XernerxMessageCommandHandlerOptions) {
		const config = z
			.object({
				directory: z.string(),
				prefix: z.union([z.string(), z.array(z.string())]).default([]),
				mention: z.boolean().default(false),
				seperator: z.string().default(' '),
				handleEdits: z.boolean().default(false),
				handleDeletions: z.boolean().default(false),
				ignore: z
					.object({
						system: z.boolean().default(true),
						bots: z.boolean().default(true),
						self: z.boolean().default(true),
					})
					.default({ system: true, bots: true, self: true }),
			})
			.parse(options);

		typeof config.prefix == 'string' ? (config.prefix = [config.prefix]) : config.prefix;

		this.client.handler.message = config;

		const files = this.loadFiles(config.directory);

		this.loadEvents(XernerxMessageCreateEvent, XernerxMessageUpdateEvent, XernerxMessageDeleteEvent);

		if (!this.client.options.intents.has('GuildMessages')) new XernerxError(`Missing ${sharpyy('GuildMessages', 'txYellow')} intent, message commands will not work.`);
		if (!this.client.options.intents.has('MessageContent') && !config.mention)
			new XernerxError(`Missing ${sharpyy('MessageContent', 'txYellow')} intent and bot mention is turned off, message commands will not work.`);
		if (!this.client.options.intents.has('MessageContent') && config.mention)
			new XernerxWarn(`Missing ${sharpyy('MessageContent', 'txYellow')} intent, message commands can only be triggered by @mention.`);

		for (const file of files) {
			await this.loadMessageCommand(file);
		}

		new XernerxSuccess(`Loaded message commands: ${this.client.commands.message.map((command) => sharpyy(command.id, 'txYellow')).join(', ')}`);
	}

	public async loadSlashCommand(file: string) {
		return await this.loadFile(file);
	}

	public async loadSlashCommands(options: XernerxSlashCommandHandlerOptions) {
		const config = z
			.object({
				directory: z.string(),
			})
			.parse(options);

		this.client.handler.slash = config;

		const files = this.loadFiles(config.directory);

		for (const file of files) {
			await this.loadSlashCommand(file);
		}

		this.loadEvents(XernerxInteractionCreateEvent, XernerxReadyEvent);

		new XernerxSuccess(`Loaded slash commands: ${this.client.commands.slash.map((command) => sharpyy(command.id, 'txYellow')).join(', ')}`);
	}

	private async loadEvents(...args: Array<typeof XernerxEventBuilder>) {
		for (const event of args) {
			this.importFile(new event('', { name: '' }));
		}
	}
}
