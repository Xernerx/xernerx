import {
	Collection,
	GatewayVersion,
	InteractionType,
	REST,
	Routes,
	Message,
	PartialMessage,
} from "discord.js";

import XernerxClient from "../client/XernerxClient.js";
import {
	InteractionCommandUtil,
	MessageCommandUtil,
} from "../utils/CommandUtil.js";
import { CommandArguments, messageArgs } from "./CommandArguments.js";
import commandValidation from "./CommandValidations.js";
import { Style } from "dumfunctions";
import { InhibitorValidation } from "./InhibitorValidations.js";
import {
	XernerxMessage,
	XernerxUser,
} from "../interfaces/HandlerInterfaces.js";

export class MessageCommandEvents {
	client: XernerxClient;

	constructor(client: XernerxClient) {
		this.client = client;
	}

	messageCreate() {
		this.client.on("messageCreate", async (message: Message) => {
			if (!message.author.bot) {
				let command: string | undefined = undefined,
					px: string | undefined = undefined;

				(message.author as XernerxUser).isOwner = this.client.util.isOwner(
					message.author.id
				);

				(message as XernerxMessage).util = new MessageCommandUtil(
					this.client,
					message
				);

				const commands: Collection<string, object> =
					this.client.commands.message;
				commands
					.filter((c: any) => !c.regex)
					.map(async (cmd: any) => {
						if (cmd.prefix) {
							cmd.prefix.map((prefix: string) => {
								if (message.content.startsWith(prefix)) {
									command = message.content
										.replace(prefix, "")
										.split(/ +/)
										.shift();

									px = prefix;
								}
							});
						}

						if (this.client.handlerOptions.message?.prefix) {
							const prefix = Array.isArray(
								this.client.handlerOptions.message.prefix
							)
								? this.client.handlerOptions.message.prefix
								: [this.client.handlerOptions.message.prefix];

							prefix.map((prefix: string) => {
								if (message.content.startsWith(prefix)) {
									command = message.content
										.replace(prefix, "")
										.split(/ +/)
										.shift();

									px = prefix;
								}
							});
						}

						if (this.client.handlerOptions.message?.allowMention) {
							if (
								message.mentions.users.has(this.client.user?.id || "") ||
								message.mentions.repliedUser?.id === this.client.user?.id
							) {
								command = message.content
									.replace(`<@${this.client.user?.id}>`, "")
									.trim()
									.split(/ +/)
									.shift();

								px = "MentionPrefix";
							}
						}

						const prefix = Array.isArray(
							this.client.handlerOptions.message?.prefix
						)
							? this.client.handlerOptions.message?.prefix
							: [this.client.handlerOptions.message?.prefix];

						if (
							(cmd.name.toLowerCase() == command?.toLowerCase() ||
								cmd.aliases
									?.map((c: string) => c.toLowerCase())
									?.includes(command?.toLowerCase())) &&
							(cmd.prefix.includes(px) ||
								prefix?.includes(px) ||
								px === "MentionPrefix")
						) {
							try {
								const inhibitor = new InhibitorValidation(
									this.client,
									message,
									command
								);

								if (commandValidation(message, cmd, this.client)) return;

								if (await inhibitor.inhibit()) return;

								if (cmd.conditions && (await cmd.conditions(message))) return;

								await cmd.exec(message, await messageArgs(message, cmd));

								this.client.emit("commandRun", message, cmd);
							} catch (error) {
								return this.client.emit("commandError", message, error, cmd);
							}
						}
					});
			}
		});
	}

	messageUpdate() {
		this.client.on(
			"messageUpdate",
			async (
				old: Message | PartialMessage,
				message: Message | PartialMessage
			) => {
				message = message as XernerxMessage; // could just do this
				if (!message.author?.bot) {
					let command: string | undefined = undefined,
						px: string | undefined = undefined;

					if (message.author)
						(message.author as XernerxUser).isOwner = this.client.util.isOwner(
							message.author.id
						);

					(message as XernerxMessage).util = new MessageCommandUtil(
						this.client,
						message as XernerxMessage
					);

					const commands: Collection<string, object> =
						this.client.commands.message;

					commands
						.filter((c: any) => !c.regex)
						.map(async (cmd: any) => {
							if (cmd.prefix) {
								cmd.prefix.map((prefix: string) => {
									if (message?.content?.startsWith(prefix)) {
										command = message.content
											.replace(prefix, "")
											.split(/ +/)
											.shift();

										px = prefix;
									}
								});
							}

							if (this.client.handlerOptions.message?.prefix) {
								const prefix = Array.isArray(
									this.client.handlerOptions.message.prefix
								)
									? this.client.handlerOptions.message.prefix
									: [this.client.handlerOptions.message.prefix];

								prefix.map((prefix: string) => {
									if (message?.content?.startsWith(prefix)) {
										command = message.content
											.replace(prefix, "")
											.split(/ +/)
											.shift();

										px = prefix;
									}
								});
							}

							if (this.client.handlerOptions.message?.allowMention) {
								if (
									message.mentions.users.has(this.client.user?.id || "") ||
									message.mentions.repliedUser?.id === this.client.user?.id
								) {
									command = message?.content
										?.replace(`<@${this.client.user?.id}>`, "")
										.trim()
										.split(/ +/)
										.shift();

									px = "MentionPrefix";
								}
							}

							const prefix = Array.isArray(
								this.client.handlerOptions.message?.prefix
							)
								? this.client.handlerOptions.message?.prefix
								: [this.client.handlerOptions.message?.prefix];

							if (
								(cmd.name.toLowerCase() == command?.toLowerCase() ||
									cmd.aliases
										?.map((c: string) => c.toLowerCase())
										?.includes(command?.toLowerCase())) &&
								(cmd.prefix.includes(px) ||
									prefix?.includes(px) ||
									px === "MentionPrefix")
							) {
								try {
									const inhibitor = new InhibitorValidation(
										this.client,
										message as Message,
										command
									);

									if (
										commandValidation(
											message as XernerxMessage,
											cmd,
											this.client
										)
									)
										return;

									if (await inhibitor.inhibit()) return;

									if (cmd.conditions && (await cmd.conditions(message))) return;

									await cmd.exec(
										message as XernerxMessage,
										await messageArgs(message, cmd)
									);

									this.client.emit("commandRun", message, cmd);
								} catch (error) {
									return this.client.emit("commandError", message, error, cmd);
								}
							}
						});
				}
			}
		);
	}

	messageDelete() {
		this.client.on("messageDelete", async (message: any) => {
			if (
				this.client.cache.messages.has(message.id) &&
				this.client.handlerOptions.message?.handleDeletes
			) {
				try {
					const msg: any = this.client.cache.messages.get(message.id);
					const response = await message.channel.messages.fetch(msg?.response);

					await response.delete();
				} catch { }
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
		this.client.on("interactionCreate", async (interaction: any) => {
			interaction.util = new InteractionCommandUtil(this.client, interaction);

			interaction.user.isOwner = this.client.util.isOwner(interaction.user.id);

			if (interaction.type === InteractionType.ApplicationCommand) {
				if (this.client.commands.slash.has(interaction.commandName)) {
					let command: any = this.client.commands.slash.get(
						interaction.commandName
					);

					const argumentsInfo = new CommandArguments(interaction);

					try {
						const inhibitor = new InhibitorValidation(
							this.client,
							interaction,
							command
						);

						if (await inhibitor.inhibit()) return;

						if (commandValidation(interaction, command, this.client)) return;

						if (
							command.defer?.reply !== false &&
							this.client.handlerOptions.slash?.defer?.reply
						) {
							await interaction.deferReply({
								ephemeral: this.client.handlerOptions.slash?.defer?.ephemeral,
								fetchReply: this.client.handlerOptions.slash?.defer?.fetchReply,
							});
						}

						if (
							!(interaction.deferred || interaction.replied) &&
							command.defer?.reply
						) {
							await interaction.deferReply({
								ephemeral: command.defer?.ephemeral,
								fetchReply: command.defer?.fetchReply,
							});
						}

						if (
							command.conditions &&
							(await command.conditions(interaction, {
								group: argumentsInfo.group(),
								subcommand: argumentsInfo.subcommand(),
								args: await argumentsInfo.arguments(),
							}))
						)
							return;

						await command.exec(interaction, {
							group: argumentsInfo.group(),
							subcommand: argumentsInfo.subcommand(),
							args: await argumentsInfo.arguments(),
						});

						this.client.emit("commandRun", interaction, command);
					} catch (error) {
						this.client.emit("commandError", interaction, error, command);
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
		this.client.on("interactionCreate", async (interaction: any) => {
			interaction.util = new InteractionCommandUtil(this.client, interaction);

			interaction.user.isOwner = this.client.util.isOwner(interaction.user.id);

			if (interaction.type === InteractionType.ApplicationCommand) {
				if (this.client.commands.context.has(interaction.commandName)) {
					let command: any = this.client.commands.context.get(
						interaction.commandName
					);

					try {
						const inhibitor = new InhibitorValidation(
							this.client,
							interaction,
							command
						);

						if (commandValidation(interaction, command, this.client)) return;

						if (await inhibitor.inhibit()) return;

						if (command.conditions && (await command.conditions(interaction)))
							return;

						if (
							command.defer?.reply !== false &&
							this.client.handlerOptions.context?.defer?.reply
						) {
							await interaction.deferReply({
								ephemeral: this.client.handlerOptions.context?.defer?.ephemeral,
								fetchReply:
									this.client.handlerOptions.context?.defer?.fetchReply,
							});
						}

						if (
							!(interaction.deferred || interaction.replied) &&
							command.defer?.reply
						) {
							await interaction.deferReply({
								ephemeral: command.defer?.ephemeral,
								fetchReply: command.defer?.fetchReply,
							});
						}

						await command.exec(interaction);

						this.client.emit("commandRun", interaction, command);
					} catch (error) {
						this.client.emit("commandError", interaction, error, command);
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
		this.client.once("ready", async (client) => {
			const rest = new REST({ version: GatewayVersion }).setToken(client.token);

			const commands = [
				...this.client.commands.context,
				...this.client.commands.slash,
			];

			const deployableCommands: object[] = [];

			commands.map((commands) =>
				commands.map((command: any) => {
					if (command?.data) {
						deployableCommands.push(command.data.toJSON());
					}
				})
			);

			try {
				if (
					this.client.handlerOptions.context?.global === true ||
					this.client.handlerOptions.slash?.global === true
				) {
					rest.put(Routes.applicationCommands(client.user.id), {
						body: deployableCommands,
					});

					rest.put(
						Routes.applicationGuildCommands(
							client.user.id,
							this.client.handlerOptions.slash?.guildId ||
							this.client.handlerOptions.context?.guildId ||
							""
						),
						{
							body: [],
						}
					);
				}
				if (
					this.client.handlerOptions.context?.global === false ||
					this.client.handlerOptions.slash?.global === false
				) {
					rest.put(
						Routes.applicationGuildCommands(
							client.user.id,
							this.client.handlerOptions.slash?.guildId ||
							this.client.handlerOptions.context?.guildId ||
							""
						),
						{
							body: deployableCommands,
						}
					);
				}

				if (
					this.client.handlerOptions.slash?.logging ||
					this.client.handlerOptions?.context?.logging
				)
					console.info(Style.log(
						`Xernerx | Deployed ${deployableCommands.length} of ${commands.length
						} interaction commands ${this.client.handlerOptions.slash?.global ||
							this.client.handlerOptions.context?.global
							? `globally in ${(await this.client.guilds.fetch()).size
							} server(s), deleted local commands.`
							: "locally"
						}.`, { color: Style.TextColor.Purple }
					));
			} catch (error) {
				console.error(Style.log(`Xernerx | Couldn't deploy interaction commands because <${error}>.`, { color: Style.BackgroundColor.Red }));
			}
		});
	}
}
