import { Collection, GatewayVersion, InteractionType, REST, Routes, Message, PartialMessage } from 'discord.js';

import XernerxClient from '../client/XernerxClient.js';
import { InteractionCommandUtil, MessageCommandUtil } from '../utils/CommandUtil.js';
import { InteractionArguments, messageArguments } from './CommandArguments.js';
import commandValidation from './CommandValidations.js';
import { Style } from 'dumfunctions';
import { InhibitorValidation } from './InhibitorValidations.js';
import { XernerxMessage, XernerxUser } from '../types/types.js';
import { MessageCommandBuilder } from '../main.js';
import { MessageArgOptions } from '../types/options.js';

export class MessageCommandEvents {
	client: XernerxClient;

	constructor(client: XernerxClient) {
		this.client = client;
	}

	messageCreate() {
		this.client.on('messageCreate', async (message: Message) => {
			if (!message.author.bot) {
				let command: string | undefined = undefined,
					px: string | undefined = undefined;

				(message.author as XernerxUser).isOwner = this.client.util.isOwner(message.author.id);

				(message as XernerxMessage).util = new MessageCommandUtil(this.client, message);

				const commands: Collection<string, MessageCommandBuilder> = this.client.commands.message;
				commands
					.filter((c) => !c.regex)
					.map(async (cmd) => {
						if (cmd.prefix) {
							(cmd.prefix as Array<string>).map((prefix) => {
								if (message.content.startsWith(prefix)) {
									command = message.content.replace(prefix, '').split(/ +/).shift();

									px = prefix;
								}
							});
						}

						if (this.client.handlerOptions.message?.prefix) {
							const prefix = Array.isArray(this.client.handlerOptions.message.prefix) ? this.client.handlerOptions.message.prefix : [this.client.handlerOptions.message.prefix];

							prefix.map((prefix: string) => {
								if (message.content.startsWith(prefix)) {
									command = message.content.replace(prefix, '').split(/ +/).shift();

									px = prefix;
								}
							});
						}

						if (this.client.handlerOptions.message?.allowMention) {
							if (message.mentions.users.has(this.client.user?.id as string) || message.mentions.repliedUser?.id === this.client.user?.id) {
								command = message.content.replace(`<@${this.client.user?.id}>`, '').trim().split(/ +/).shift();

								px = 'MentionPrefix';
							}
						}

						const prefix = Array.isArray(this.client.handlerOptions.message?.prefix) ? this.client.handlerOptions.message?.prefix : [this.client.handlerOptions.message?.prefix];

						if (
							(cmd.name.toLowerCase() == command?.toLowerCase() || cmd.aliases?.map((c: string) => c.toLowerCase())?.includes((command as string)?.toLowerCase())) &&
							((cmd.prefix as Array<string>).includes(px as string) || prefix?.includes(px) || px === 'MentionPrefix')
						) {
							try {
								if (this.client.handlerOptions.message?.handleTyping) message.channel.sendTyping();

								const inhibitor = new InhibitorValidation(this.client, message, command as string);

								if (commandValidation(message, cmd, this.client)) return;

								if (await inhibitor.inhibit()) return;

								if ((cmd.conditions as unknown) && ((await cmd.conditions(message, (await messageArguments(message, cmd)) as unknown as MessageArgOptions)) as unknown)) return;

								await cmd.exec(message, (await messageArguments(message, cmd)) as unknown as MessageArgOptions);

								this.client.emit('commandRun', message, cmd);
							} catch (error) {
								return this.client.emit('commandError', message, error, cmd);
							}
						}
					});
			}
		});
	}

	messageUpdate() {
		this.client.on('messageUpdate', async (old: Message | PartialMessage, message: Message | PartialMessage) => {
			message = message as XernerxMessage;

			if (!message.author?.bot) {
				let command: string | undefined = undefined,
					px: string | undefined = undefined;

				if (message.author) (message.author as XernerxUser).isOwner = this.client.util.isOwner(message.author.id);

				(message as XernerxMessage).util = new MessageCommandUtil(this.client, message as XernerxMessage);

				const commands: Collection<string, MessageCommandBuilder> = this.client.commands.message;

				commands
					.filter((c) => !c.regex)
					.map(async (cmd) => {
						if (cmd.prefix) {
							(cmd.prefix as Array<string>).map((prefix) => {
								if (message?.content?.startsWith(prefix)) {
									command = message.content.replace(prefix, '').split(/ +/).shift();

									px = prefix;
								}
							});
						}

						if (this.client.handlerOptions.message?.prefix) {
							const prefix = Array.isArray(this.client.handlerOptions.message.prefix) ? this.client.handlerOptions.message.prefix : [this.client.handlerOptions.message.prefix];

							prefix.map((prefix: string) => {
								if (message?.content?.startsWith(prefix)) {
									command = message.content.replace(prefix, '').split(/ +/).shift();

									px = prefix;
								}
							});
						}

						if (this.client.handlerOptions.message?.allowMention) {
							if (message.mentions.users.has(this.client.user?.id || '') || message.mentions.repliedUser?.id === this.client.user?.id) {
								command = message?.content?.replace(`<@${this.client.user?.id}>`, '').trim().split(/ +/).shift();

								px = 'MentionPrefix';
							}
						}

						const prefix = Array.isArray(this.client.handlerOptions.message?.prefix) ? this.client.handlerOptions.message?.prefix : [this.client.handlerOptions.message?.prefix];

						if (
							(cmd.name.toLowerCase() == command?.toLowerCase() || cmd.aliases?.map((c: string) => c.toLowerCase())?.includes((command as string)?.toLowerCase())) &&
							((cmd.prefix as Array<string>).includes(px as string) || prefix?.includes(px) || px === 'MentionPrefix')
						) {
							try {
								if (this.client.handlerOptions.message?.handleTyping) message.channel.sendTyping();

								message = message as XernerxMessage;

								const inhibitor = new InhibitorValidation(this.client, message as Message, command as string);

								if (commandValidation(message, cmd, this.client)) return;

								if (await inhibitor.inhibit()) return;

								if ((cmd.conditions as unknown) && ((await cmd.conditions(message, (await messageArguments(message, cmd)) as unknown as MessageArgOptions)) as unknown)) return;

								await cmd.exec(message, (await messageArguments(message, cmd)) as unknown as MessageArgOptions);

								this.client.emit('commandRun', message, cmd);
							} catch (error) {
								return this.client.emit('commandError', message, error, cmd);
							}
						}
					});
			}
		});
	}

	messageDelete() {
		this.client.on('messageDelete', async (message: unknown) => {
			if (this.client.cache.messages.has((message as XernerxMessage).id) && this.client.handlerOptions.message?.handleDeletes) {
				if (this.client.handlerOptions.message?.handleTyping) (message as XernerxMessage).channel.sendTyping();

				try {
					const msg: unknown = this.client.cache.messages.get((message as XernerxMessage).id);

					const response = await (message as XernerxMessage).channel.messages.fetch((msg as Record<'response', string>)?.response);

					await response.delete();
				} catch {}
			}
		});
	}
}

export class SlashCommandEvents {
	client: XernerxClient;

	constructor(client: XernerxClient) {
		this.client = client;
	}

	slashCreate() {
		this.client.on('interactionCreate', async (interaction: any) => {
			interaction.util = new InteractionCommandUtil(this.client, interaction);

			interaction.user.isOwner = this.client.util.isOwner(interaction.user.id);

			if (interaction.type === InteractionType.ApplicationCommand) {
				if (this.client.commands.slash.has(interaction.commandName)) {
					let command: any = this.client.commands.slash.get(interaction.commandName);

					const argumentsInfo = new InteractionArguments(interaction);

					try {
						const inhibitor = new InhibitorValidation(this.client, interaction, command);

						if (await inhibitor.inhibit()) return;

						if (commandValidation(interaction, command, this.client)) return;

						if (command.defer?.reply !== false && this.client.handlerOptions.slash?.defer?.reply)
							await interaction.deferReply({ ephemeral: this.client.handlerOptions.slash?.defer?.ephemeral, fetchReply: this.client.handlerOptions.slash?.defer?.fetchReply });

						if (!(interaction.deferred || interaction.replied) && command.defer?.reply) await interaction.deferReply({ ephemeral: command.defer?.ephemeral, fetchReply: command.defer?.fetchReply });

						if (command.conditions && (await command.conditions(interaction, { group: argumentsInfo.group(), subcommand: argumentsInfo.subcommand(), args: await argumentsInfo.arguments() }))) return;

						await command.exec(interaction, { group: argumentsInfo.group(), subcommand: argumentsInfo.subcommand(), args: await argumentsInfo.arguments() });

						this.client.emit('commandRun', interaction, command);
					} catch (error) {
						this.client.emit('commandError', interaction, error, command);
					}
				}
			}
		});
	}
}

export class ContextCommandEvents {
	client: XernerxClient;

	constructor(client: XernerxClient) {
		this.client = client;
	}

	contextCreate() {
		this.client.on('interactionCreate', async (interaction: any) => {
			interaction.util = new InteractionCommandUtil(this.client, interaction);

			interaction.user.isOwner = this.client.util.isOwner(interaction.user.id);

			if (interaction.type === InteractionType.ApplicationCommand) {
				if (this.client.commands.context.has(interaction.commandName)) {
					let command: any = this.client.commands.context.get(interaction.commandName);

					try {
						const inhibitor = new InhibitorValidation(this.client, interaction, command);

						if (commandValidation(interaction, command, this.client)) return;

						if (await inhibitor.inhibit()) return;

						if (command.conditions && (await command.conditions(interaction))) return;

						if (command.defer?.reply !== false && this.client.handlerOptions.context?.defer?.reply)
							await interaction.deferReply({ ephemeral: this.client.handlerOptions.context?.defer?.ephemeral, fetchReply: this.client.handlerOptions.context?.defer?.fetchReply });

						if (!(interaction.deferred || interaction.replied) && command.defer?.reply) await interaction.deferReply({ ephemeral: command.defer?.ephemeral, fetchReply: command.defer?.fetchReply });

						await command.exec(interaction);

						this.client.emit('commandRun', interaction, command);
					} catch (error) {
						this.client.emit('commandError', interaction, error, command);
					}
				}
			}
		});
	}
}

export class CommandsDeploy {
	client: XernerxClient;

	constructor(client: XernerxClient) {
		this.client = client;
	}

	deploy() {
		this.client.once('ready', async (client) => {
			const slashCommands: Array<object> = [],
				contextCommands: Array<object> = [];

			this.client.commands.context.map((command) => (command.data ? contextCommands.push(command.data.toJSON()) : null));
			this.client.commands.slash.map((command) => (command.data ? slashCommands.push(command.data.toJSON()) : null));

			try {
				const global = { slash: this.client.handlerOptions.slash?.global, context: this.client.handlerOptions.context?.global };
				const guild = { slash: this.client.handlerOptions.slash?.guildId, context: this.client.handlerOptions.context?.guildId };

				if (global.slash && global.context) {
					if (guild.slash !== guild.context)
						console.info(
							Style.log(
								`Xernerx | Warning: slash and context commands are both set to global, but don't have a matching guildId, using ${
									(await this.client.guilds.fetch(this.client.handlerOptions.slash?.guildId as string)).name
								}!`,
								{ color: Style.TextColor.Red }
							)
						);

					this.put('global', guild.slash as string, [...contextCommands, ...slashCommands]);

					this.put('guild', guild.slash as string, []);
				}

				if (global.slash && !global.context) {
					this.put('global', guild.slash as string, slashCommands);
				}

				if (!global.slash && global.context) {
					this.put('global', guild.context as string, contextCommands);
				}

				if (!global.slash && !global.context) {
					this.put('guild', guild.slash as string, [...contextCommands, ...slashCommands]);
				}

				console.log(
					Style.log(
						`Xernerx | Deployed ${slashCommands.length} slash commands ${global.slash ? 'globally' : 'locally'} and ${contextCommands.length} context commands ${
							global.context ? 'globally' : 'locally'
						}.`,
						{ color: Style.TextColor.Purple }
					)
				);
			} catch (error) {
				console.error(Style.log(`Xernerx | Couldn't deploy interaction commands because <${error}>.`, { color: Style.BackgroundColor.Red }));
			}
		});
	}

	put(type: string, guild: string, body: Array<object>) {
		const rest = new REST({ version: GatewayVersion }).setToken(this.client.token as string);

		if (type === 'guild') rest.put(Routes.applicationGuildCommands(this.client.user?.id as string, guild), { body });
		else rest.put(Routes.applicationCommands(this.client.user?.id as string), { body });
	}
}
