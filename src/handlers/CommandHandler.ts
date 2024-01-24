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
import XernerxMessageCommand from '../build/XernerxMessageCommand.js';
import XernerxSlashCommand from '../build/XernerxSlashCommand.js';
import { filetype } from '../types/types.js';
import { xernerxUser } from '../functions/xernerxUser.js';
import InteractionUtil from '../utils/InteractionUtil.js';
import commandValidation from '../validators/commandValidation.js';
import XernerxLog from '../tools/XernerxLog.js';
import { interactionArguments, messageArguments } from '../models/Arguments.js';
import { inhibitorValidation } from '../validators/inhibitorValidations.js';
import { Style } from 'dumfunctions';

export default class CommandHandler extends Handler {
	public declare readonly readyTimestamp;

	constructor(client: XernerxClient) {
		super(client);

		this.readyTimestamp = Number(Date.now());
	}

	public async loadMessageCommands(options: MessageHandlerOptions) {
		const commands = [];

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
						user: z.array(z.string()).or(z.null()).default(null),
						client: z.array(z.string()).or(z.null()).default(null),
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
			const filepath = `${path.resolve(options.directory)}\\${file}`;

			const command = await this.load(filepath, 'MessageCommand');

			this._checks(command);

			commands.push(command.id);
		}

		new XernerxLog(this.client).info(
			`Loaded ${Style.log(String(files.length), { color: Style.TextColor.Cyan })} Message Commands: ${commands.map((command) => Style.log(command, { color: Style.TextColor.LightYellow })).join(', ')}`
		);

		this.emit({
			name: 'messageCreate',
			filetype: 'MessageCommand',
			run: (message: XernerxMessage) => this.messageCommandRun(message),
		});

		this.emit({
			name: 'messageUpdate',
			filetype: 'MessageCommand',
			run: (message: XernerxMessage, message2: XernerxMessage) => this.messageCommandRun(message, message2),
		});

		this.emit({
			name: 'messageDelete',
			filetype: 'MessageCommand',
			run: (message: XernerxMessage) => this.messageCommandRun(message, 'delete'),
		});

		this.client.on('messageReactionAdd', (message) => {
			(message as any).util = new MessageUtil(this.client, message as unknown as XernerxMessage);
		});

		this.client.on('messageReactionRemove', (message) => {
			(message as any).util = new MessageUtil(this.client, message as unknown as XernerxMessage);
		});

		this.client.on('messageReactionRemoveAll', (message) => {
			(message as any).util = new MessageUtil(this.client, message as unknown as XernerxMessage);
		});

		this.client.on('messageReactionRemoveEmoji', (message) => {
			(message as any).util = new MessageUtil(this.client, message as unknown as XernerxMessage);
		});
	}

	// public reloadMessageCommands() {
	// 	return reload(this.client, 'message');
	// }

	public async loadSlashCommands(options: SlashHandlerOptions) {
		const commands = [];

		if (!this.client.settings.local) new XernerxLog(this.client).warn(`Slash commands might not work as you haven't specified a local guild ID.`);

		options = z
			.object({
				directory: z.string(),
				cooldown: z.number().default(0),
				permissions: z
					.object({
						user: z.array(z.string()).or(z.null()).default(null),
						client: z.array(z.string()).or(z.null()).default(null),
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
			const filepath = `${path.resolve(options.directory)}\\${file}`;

			const command = await this.load(filepath, 'SlashCommand');

			commands.push(command.id);
		}

		new XernerxLog(this.client).info(
			`Loaded ${Style.log(String(files.length), { color: Style.TextColor.Cyan })} Slash Commands: ${commands.map((command) => Style.log(command, { color: Style.TextColor.LightYellow })).join(', ')}`
		);

		this.emit({
			name: 'interactionCreate',
			filetype: 'SlashCommand',
			run: (interaction: XernerxSlashInteraction) => this.slashCommandRun(interaction),
		});
	}

	public async loadContextCommands(options: ContextHandlerOptions) {
		const commands = [];

		if (!this.client.settings.local) new XernerxLog(this.client).warn(`Context commands might not work as you haven't specified a local guild ID.`);

		options = z
			.object({
				directory: z.string(),
				cooldown: z.number().default(0),
				permissions: z
					.object({
						user: z.array(z.string()).or(z.null()).default(null),
						client: z.array(z.string()).or(z.null()).default(null),
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
			const filepath = `${path.resolve(options.directory)}\\${file}`;

			const command = await this.load(filepath, 'ContextCommand');

			commands.push(command.id);
		}

		new XernerxLog(this.client).info(
			`Loaded ${Style.log(String(files.length), { color: Style.TextColor.Cyan })} Context Commands: ${commands.map((command) => Style.log(command, { color: Style.TextColor.LightYellow })).join(', ')}`
		);

		this.emit({
			name: 'interactionCreate',
			filetype: 'ContextCommand',
			run: (interaction: XernerxMessageContextInteraction | XernerxUserContextInteraction) => this.contextCommandRun(interaction),
		});
	}

	private async messageCommandRun<T extends XernerxMessage>(message: T, message2?: T | 'delete') {
		const filetype = 'MessageCommand';

		if (message.author.id === this.client.user?.id && this.client.settings.ignore?.self) return;
		else if (message.author.bot && this.client.settings.ignore?.bots) return;

		if (message.system && this.client.settings.ignore?.system) return;

		message.util = new MessageUtil(this.client, message);
		message.user = await xernerxUser(message, this.client);

		if (await inhibitorValidation(message, undefined, undefined, 'pre')) return;

		if (typeof message2 === 'object') message = message2;

		if (message2 === 'delete' && this.client.modules.options.message?.handleDeletes) {
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
					commandName =
						message.content
							.replace(`<@${this.client.user?.id}>`, '')
							.trim()
							.split(/ +/)
							.shift()
							?.toLowerCase() || null;

					commands.map((command) => {
						if (command.aliases?.includes(commandName as string)) {
							commandName = command.name;
							return (commandAlias = commandName);
						}
					});

					commandPrefix = `<@${this.client.user?.id}>`;
				}
			}

			if (this.client.commands.message.has(commandName as string)) {
				if (this.client.modules.options.message?.handleTyping) message.channel.sendTyping();

				cmd = this.client.commands.message.get(commandName as string);
			}

			if (!commandPrefix || !commandName) return;

			if (!cmd) return await this.client.emit('commandNotFound', message, commandName, filetype);

			await this.client.emit('commandStart', message, cmd);

			const args = await messageArguments(message, cmd, commandPrefix as string);

			message.util.parsed = {
				alias: commandAlias,
				prefix: commandPrefix,
				args: args.args,
			} as const;

			cmd.util = message.util;

			return await this.exec(cmd, message, args, filetype);
		}
	}

	private async slashCommandRun<T extends Record<string, any>>(interaction: XernerxSlashInteraction) {
		const filetype = 'SlashCommand';

		interaction.util = new InteractionUtil(this.client, interaction);

		interaction.user = await xernerxUser(interaction, this.client);

		if (await inhibitorValidation(interaction, undefined, undefined, 'pre')) return;

		let cmd: XernerxSlashCommand | null | undefined = null;

		if (this.client.commands.slash.has(interaction.commandName)) cmd = this.client.commands.slash.get(interaction.commandName);

		if (!cmd) return this.client.emit('commandNotFound', interaction, interaction.commandName, filetype);

		new Promise(async (resolve) => {
			if (interaction.isAutocomplete()) {
				const focused = (interaction as T).options.getFocused(true);
				const options = (interaction as T).options;

				await (cmd as XernerxSlashCommand).autocomplete(interaction, focused, options);
			} else resolve(true);
		})
			.then(async () => {
				await this.client.emit('commandStart', interaction);

				const args = await interactionArguments(interaction, cmd as XernerxSlashCommand);

				interaction.util.parsed = {
					alias: [interaction.commandName, args.group || null, args.subcommand || null].filter((x) => x).join(' '),
					args: args.args,
				} as const;

				(cmd as XernerxSlashCommand).util = interaction.util;

				return await this.exec(cmd as XernerxSlashCommand, interaction, args, filetype);
			})
			.catch((error) => this.client.emit('commandError', interaction, error, cmd, filetype));
	}

	private async contextCommandRun(interaction: XernerxUserContextInteraction | XernerxMessageContextInteraction) {
		const filetype = 'ContextCommand';

		interaction.util = new InteractionUtil(this.client, interaction);

		interaction.user = await xernerxUser(interaction as XernerxUserContextInteraction, this.client);

		if (await inhibitorValidation(interaction, undefined, undefined, 'pre')) return;

		let cmd;

		if (this.client.commands.context.has(interaction.commandName)) cmd = this.client.commands.context.get(interaction.commandName);

		if (!cmd) return this.client.emit('commandNotFound', interaction, interaction.commandName, filetype);

		await this.client.emit('commandStart', interaction);

		const args = await interactionArguments(interaction, cmd);

		interaction.util.parsed = {
			alias: interaction.commandName,
			args: args,
		} as const;

		(cmd as XernerxContextCommand).util = interaction.util;

		return await this.exec(cmd as XernerxContextCommand, interaction, args, filetype);
	}

	private async exec(
		cmd: XernerxMessageCommand | XernerxSlashCommand | XernerxContextCommand,
		event: XernerxMessage | XernerxSlashInteraction | XernerxMessageContextInteraction | XernerxUserContextInteraction,
		args: any,
		type: filetype
	) {
		try {
			if (cmd.filetype == 'SlashCommand' && ((cmd as XernerxSlashCommand)?.defer?.reply ?? this.client.modules.options.slash?.defer?.reply)) {
				await (event as XernerxSlashInteraction).deferReply({
					ephemeral: cmd.defer?.ephemeral || this.client.modules.options.slash?.defer?.ephemeral || false,
				});
			}

			if (cmd.filetype == 'ContextCommand' && ((cmd as XernerxContextCommand)?.defer?.reply ?? this.client.modules.options.context?.defer?.reply)) {
				await (event as XernerxMessageContextInteraction | XernerxUserContextInteraction).deferReply({
					ephemeral: cmd.defer?.ephemeral || this.client.modules.options.context?.defer?.ephemeral || false,
				});
			}

			if (await commandValidation(event as XernerxMessage, cmd)) return;

			if (await inhibitorValidation(event, args, cmd, 'check')) return;

			if (((cmd as XernerxMessageCommand).conditions as unknown) && (await ((cmd as XernerxMessageCommand).conditions(event as never, args) as unknown))) return;

			await cmd.exec(event as never, args);

			await inhibitorValidation(event, args, cmd, 'post');

			return await this.client.emit('commandFinish', event, cmd);
		} catch (error) {
			new XernerxLog(this.client).error(`An error occurred executing ${Style.log(cmd.name, { color: Style.TextColor.Blue })}`, error);

			return await this.client.emit('commandError', event, error, cmd, type);
		}
	}

	private _checks(command: XernerxMessageCommand | XernerxSlashCommand | XernerxContextCommand) {
		if ((command.strict?.voice || command.ignore?.voice) && !this.client.options.intents.has('GuildVoiceStates'))
			new XernerxLog(this.client).warn(
				`${Style.log(command.id, { color: Style.TextColor.Blue })} options ${Style.log(`Xernerx${command.filetype}#strict#voice`, {
					color: Style.BackgroundColor.Grey,
				})} or ${Style.log(`Xernerx${command.filetype}#ignore#voice`, {
					color: Style.BackgroundColor.Grey,
				})} will misbehave due to missing the ${Style.log('GuildVoiceStates', { color: Style.TextColor.Yellow })} intent.`
			);
	}
}
