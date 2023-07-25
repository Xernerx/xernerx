/** @format */

import { z } from 'zod';
import * as path from 'path';
import { GatewayIntentBits } from 'discord.js';

import XernerxClient from '../client/XernerxClient.js';
import { ContextHandlerOptions, MessageHandlerOptions, SlashHandlerOptions } from '../types/interfaces.js';
import Handler from './Handler.js';
import { XernerxMessage, XernerxMessageContextInteraction, XernerxSlashInteraction, XernerxUserContextInteraction } from '../types/extenders.js';
import MessageUtil from '../utils/MessageUtil.js';
import XernerxContextCommand from '../build/XernerxContextCommand.js';
import MessageCommandBuilder from '../build/XernerxMessageCommand.js';
import XernerxSlashCommand from '../build/XernerxSlashCommand.js';
import { FileType } from '../types/types.js';
import { xernerxUser } from '../functions/xernerxUser.js';
import InteractionUtil from '../utils/InteractionUtil.js';
import commandValidation from '../validators/commandValidation.js';
import XernerxLog from '../tools/XernerxLog.js';
import { interactionArguments, messageArguments } from '../models/Arguments.js';
import { inhibitorValidation } from '../validators/inhibitorValidations.js';
import { Style } from 'dumfunctions';

export default class CommandHandler extends Handler {
	constructor(client: XernerxClient) {
		super(client);
	}

	public loadMessageCommands(options: MessageHandlerOptions) {
		if (!this.client.options.intents.has(GatewayIntentBits.MessageContent)) new XernerxLog(this.client).warn(`Message commands might not work as you're missing the intent MessageContent!`);
		if (!this.client.options.intents.has(GatewayIntentBits.GuildMessages)) new XernerxLog(this.client).warn(`Message commands might not work as you're missing the intent GuildMessages!`);

		options = z
			.object({
				directory: z.string(),
				prefix: z.string().or(z.array(z.string())),
				allowMention: z.boolean().default(false),
				cooldown: z.number().default(0),
				permissions: z
					.object({
						user: z.array(z.string()).default([]),
						client: z.array(z.string()).default([]),
						dm: z.boolean().default(true),
					})
					.default({}),
				handleEdits: z.boolean().default(false),
				handleDeletes: z.boolean().default(false),
				handleTyping: z.boolean().default(false),
				logging: z.boolean().default(false),
			})
			.parse(options);

		this.client.modules.options.message = options;

		const files = this.readdir(options.directory);

		for (const file of files) {
			const filePath = `${path.resolve(options.directory)}\\${file}`;

			this.load(filePath, 'MessageCommand');
		}

		new XernerxLog(this.client).info(`Loaded ${Style.log(String(files.length), { color: Style.TextColor.Cyan })} Message Commands.`);

		this.emit({
			name: 'messageCreate',
			fileType: 'MessageCommand',
			run: (message: XernerxMessage) => this.messageCommandRun(message),
		});

		this.emit({
			name: 'messageUpdate',
			fileType: 'MessageCommand',
			run: (message: XernerxMessage, message2: XernerxMessage) => this.messageCommandRun(message, message2),
		});

		this.emit({
			name: 'messageDelete',
			fileType: 'MessageCommand',
			run: (message: XernerxMessage) => this.messageCommandRun(message, 'delete'),
		});
	}

	// public reloadMessageCommands() {
	//     return reload(this.client, 'message');
	// }

	public loadSlashCommands(options: SlashHandlerOptions) {
		if (!this.client.settings.local) new XernerxLog(this.client).warn(`Slash commands might not work as you haven't specified a local guild ID.`);

		options = z
			.object({
				directory: z.string(),
				cooldown: z.number().default(0),
				permissions: z
					.object({
						user: z.array(z.string()).default([]),
						client: z.array(z.string()).default([]),
						dm: z.boolean().default(true),
					})
					.default({}),
				logging: z.boolean().default(false),
				defer: z
					.object({
						reply: z.boolean().default(false),
						ephemeral: z.boolean().default(false),
						fetchReply: z.boolean().default(false),
					})
					.default({}),
			})
			.parse(options);

		this.client.modules.options.slash = options;

		const files = this.readdir(options.directory);

		for (const file of files) {
			const filePath = `${path.resolve(options.directory)}\\${file}`;

			this.load(filePath, 'SlashCommand');
		}

		new XernerxLog(this.client).info(`Loaded ${Style.log(String(files.length), { color: Style.TextColor.Cyan })} Slash Commands.`);

		this.emit({
			name: 'interactionCreate',
			fileType: 'SlashCommand',
			run: (interaction: XernerxSlashInteraction) => this.slashCommandRun(interaction),
		});
	}
	public loadContextCommands(options: ContextHandlerOptions) {
		if (!this.client.settings.local) new XernerxLog(this.client).warn(`Context commands might not work as you haven't specified a local guild ID.`);

		options = z
			.object({
				directory: z.string(),
				cooldown: z.number().default(0),
				permissions: z
					.object({
						user: z.array(z.string()).default([]),
						client: z.array(z.string()).default([]),
						dm: z.boolean().default(true),
					})
					.default({}),
				logging: z.boolean().default(false),
				defer: z
					.object({
						reply: z.boolean().default(false),
						ephemeral: z.boolean().default(false),
						fetchReply: z.boolean().default(false),
					})
					.default({}),
			})
			.parse(options);

		this.client.modules.options.context = options;

		const files = this.readdir(options.directory);

		for (const file of files) {
			const filePath = `${path.resolve(options.directory)}\\${file}`;

			this.load(filePath, 'ContextCommand');
		}

		new XernerxLog(this.client).info(`Loaded ${Style.log(String(files.length), { color: Style.TextColor.Cyan })} Context Commands.`);

		this.emit({
			name: 'interactionCreate',
			fileType: 'ContextCommand',
			run: (interaction: XernerxMessageContextInteraction | XernerxUserContextInteraction) => this.contextCommandRun(interaction),
		});
	}

	private async messageCommandRun<T extends XernerxMessage>(message: T, message2?: T | 'delete') {
		const filetype = 'MessageCommand';

		if (message.author.bot) return;

		message.util = new MessageUtil(this.client, message);

		message.user = await xernerxUser(message, this.client);

		if (typeof message2 === 'object') message = message2;

		if (message2 === 'delete') {
			if (!this.client.cache.messages.has(message.id)) return;

			const id = this.client.cache.messages.get(message.id);

			if (!id) return;

			(async () => {
				const msg = await message.channel.messages.fetch(id);

				await msg.delete();

				this.client.cache.messages.delete(message.id);
			})();

			return;
		}

		if (message.content && this.client.modules.options.message) {
			const commands = this.client.commands.message;

			const prefixes = Array.isArray(this.client.modules.options.message.prefix) ? this.client.modules.options.message.prefix : [this.client.modules.options.message.prefix];

			let commandName: string | null = null,
				cmd,
				commandAlias: string | null = null,
				commandPrefix: string | null = null;

			commands.map((command) => {
				let prefix: string | null = null;

				if (command.regex && message.content.match(command.regex)) {
					const [match] = message.content.match(command.regex) || [null];

					if (match) commandName = command.name;
				}

				const cp = Array.isArray(command.prefix) ? command.prefix : [command.prefix as string];

				prefixes.map((p) => {
					if (message.content.startsWith(p)) prefix = p;
				});

				cp.map((p) => {
					if (message.content.startsWith(p)) prefix = p;
				});

				if (!prefix) return;

				if (!commandName)
					commandName =
						message.content
							.replace(prefix, '')
							.split(command.separator || / +/)
							.shift()
							?.trim()
							?.toLowerCase() || '';

				if (!this.client.commands.message.has(commandName) && command.aliases?.includes(commandName)) {
					commandAlias = commandName;

					commandName = command.name;
				}

				commandAlias = commandAlias ? commandAlias : commandName;

				commandPrefix = prefix;
			});

			if (!cmd && this.client.modules.options.message.allowMention) {
				if (message.mentions.users.has(this.client.user?.id as string) || message.mentions.repliedUser?.id === this.client.user?.id) {
					commandName = message.content.replace(`<@${this.client.user?.id}>`, '').trim().split(/ +/).shift()?.toLowerCase() || null;

					commandPrefix = `<@${this.client.user?.id}>`;
				}
			}

			if (this.client.commands.message.has(commandName as string)) {
				if (this.client.modules.options.message?.handleTyping) message.channel.sendTyping();

				cmd = this.client.commands.message.get(commandName as string);
			}

			if (!cmd) return this.client.emit('commandNotFound', message, filetype);

			if (await inhibitorValidation(message, cmd)) return;

			message.util.parsed = {
				alias: commandAlias,
				prefix: commandPrefix,
			};

			this.client.emit('commandStart', message, cmd, filetype);

			return await this.exec(cmd, message, await messageArguments(message, cmd, commandPrefix as string), filetype);
		}
	}

	private async slashCommandRun<T extends Record<string, any>>(interaction: XernerxSlashInteraction) {
		const filetype = 'SlashCommand';

		interaction.util = new InteractionUtil(this.client, interaction);

		interaction.user = await xernerxUser(interaction, this.client);

		let cmd: XernerxSlashCommand | null | undefined = null;

		if (this.client.commands.slash.has(interaction.commandName)) cmd = this.client.commands.slash.get(interaction.commandName);

		if (await inhibitorValidation(interaction, cmd as XernerxSlashCommand)) return;

		if (!cmd) return this.client.emit('commandNotFound', interaction);

		new Promise(async (resolve) => {
			if (interaction.isAutocomplete()) {
				const focused = (interaction as T).options.getFocused(true);
				const options = (interaction as T).options;

				await (cmd as XernerxSlashCommand).autocomplete(interaction, focused, options);
			} else resolve(true);
		})
			.then(async () => {
				this.client.emit('commandStart', interaction, filetype);

				return await this.exec(cmd as XernerxSlashCommand, interaction, await interactionArguments(interaction, cmd as XernerxSlashCommand), filetype);
			})
			.catch((error) => this.client.emit('commandError', interaction, error, cmd, filetype));
	}

	private async contextCommandRun(interaction: XernerxUserContextInteraction | XernerxMessageContextInteraction) {
		const filetype = 'ContextCommand';

		interaction.util = new InteractionUtil(this.client, interaction);

		interaction.user = await xernerxUser(interaction as XernerxUserContextInteraction, this.client);

		let cmd;

		if (this.client.commands.context.has(interaction.commandName)) cmd = this.client.commands.context.get(interaction.commandName);

		if (await inhibitorValidation(interaction, cmd)) return;

		if (!cmd) return this.client.emit('commandNotFound', interaction, filetype);

		this.client.emit('commandStart', interaction, filetype);

		return await this.exec(cmd as unknown as XernerxSlashCommand, interaction, await interactionArguments(interaction, cmd), filetype);
	}

	private async exec(
		cmd: MessageCommandBuilder | XernerxSlashCommand | XernerxContextCommand,
		event: XernerxMessage | XernerxSlashInteraction | XernerxMessageContextInteraction | XernerxUserContextInteraction,
		args: any,
		type: FileType
	) {
		try {
			if (await commandValidation(event as XernerxMessage, cmd)) return;

			if (((cmd as MessageCommandBuilder).conditions as unknown) && (await ((cmd as MessageCommandBuilder).conditions(event as never, args) as unknown))) return;

			await cmd.exec(event as never, args);

			return await this.client.emit('commandFinish', event, type);
		} catch (error) {
			new XernerxLog(this.client).error(`An error occurred executing ${Style.log(cmd.name, { color: Style.TextColor.Blue })}`, error);

			return await this.client.emit('commandError', event, error, cmd, type);
		}
	}
}
