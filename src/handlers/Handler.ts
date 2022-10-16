import XernerxClient from "../client/XernerxClient.js";
import fs from "node:fs";
import * as path from "path";
import { CommandType } from "../types/Types.js";
import { s } from "@sapphire/shapeshift";
import {
	ContextCommandOptions,
	MessageCommandOptions,
	SlashCommandOptions,
	EventLoadOptions,
	InhibitorLoadOptions,
} from "../interfaces/HandlerInterfaces.js";

export class Handler {
	client: XernerxClient;
	commands: object[];

	constructor(client: XernerxClient) {
		this.client = client;

		this.commands = [];
	}

	loadAllMessageCommands(options: MessageCommandOptions) {
		this.client.handlerOptions.message = s
			.object({
				directory: s.string,
				prefix: s.union(s.string, s.array(s.string)),
				allowMention: s.boolean.default(false),
				commandCooldown: s.number.default(0),
				userPermissions: s.array(s.string).default([]),
				clientPermissions: s.array(s.string).default([]),
				handleEdits: s.boolean.default(false),
				handleDeletes: s.boolean.default(false),
				logging: s.boolean.default(false),
			})
			.parse(options);

		const files = this.#readdir(options.directory),
			loaded = [];

		for (const file of files) {
			this.#load(options.directory, file, CommandType.MessageCommand);

			loaded.push(file.replace(".js", ""));
		}

		if (this.client.handlerOptions.message.logging)
			console.info(
				`Xernerx | Loaded ${loaded.length} message commands: ${loaded.join(
					", "
				)}.`
			);
	}

	loadAllSlashCommands(options: SlashCommandOptions) {
		this.client.handlerOptions.slash = s
			.object({
				directory: s.string,
				guildId: s.string,
				global: s.boolean,
				commandCooldown: s.number.default(0),
				userPermissions: s.array(s.string).default([]),
				clientPermissions: s.array(s.string).default([]),
				logging: s.boolean.default(false),
				defer: s.object({
					reply: s.boolean.optional,
					ephemeral: s.boolean.optional,
					fetchReply: s.boolean.optional,
				}).optional,
			})
			.parse(options);

		const files = this.#readdir(options.directory),
			loaded = [];

		for (const file of files) {
			this.#load(options.directory, file, CommandType.SlashCommand);

			loaded.push(file.replace(".js", ""));
		}

		if (this.client.handlerOptions.slash.logging)
			console.info(
				`Xernerx | Loaded ${loaded.length} slash commands: ${loaded.join(
					", "
				)}.`
			);
	}

	loadAllContextCommands(options: ContextCommandOptions) {
		this.client.handlerOptions.context = s
			.object({
				directory: s.string,
				guildId: s.string,
				global: s.boolean,
				commandCooldown: s.number.default(0),
				userPermissions: s.array(s.string).default([]),
				clientPermissions: s.array(s.string).default([]),
				logging: s.boolean.default(false),
				defer: s.object({
					reply: s.boolean.optional,
					ephemeral: s.boolean.optional,
					fetchReply: s.boolean.optional,
				}).optional,
			})
			.parse(options);

		const files = this.#readdir(options.directory),
			loaded = [];

		for (const file of files) {
			this.#load(options.directory, file, CommandType.ContextCommand);

			loaded.push(file.replace(".js", ""));
		}

		if (this.client.handlerOptions.context.logging)
			console.info(
				`Xernerx | Loaded ${loaded.length} context commands: ${loaded.join(
					", "
				)}.`
			);
	}

	loadAllEvents(options: EventLoadOptions) {
		this.client.handlerOptions.events = s
			.object({
				directory: s.string,
				logging: s.boolean.default(false),
			})
			.parse(options);

		const files = this.#readdir(options.directory),
			loaded = [];

		(async () => {
			for (const file of files) {
				try {
					options.directory.split(/\//).shift();

					let event = (
						await import(
							"file://" + `${path.resolve(options.directory)}/${file}`
						)
					).default;

					event = new event();

					event.client = this.client;

					event.commandType = CommandType.Event;

					this.client.events.set(event.name, event);

					this.#emitter(event);
				} catch (error) {
					console.error(`Xernerx | Couldn't load${file} because <${error}>`);
				}

				loaded.push(file.replace(".js", ""));
			}

			if (this.client.handlerOptions.events?.logging)
				console.info(
					`Xernerx | Loaded ${loaded.length} events: ${loaded.join(", ")}.`
				);
		})();
	}

	loadAllInhibitors(options: InhibitorLoadOptions) {
		this.client.handlerOptions.inhibitors = s
			.object({
				directory: s.string,
				logging: s.boolean.default(false),
			})
			.parse(options);

		const files = this.#readdir(options.directory),
			loaded = [];

		for (const file of files) {
			this.#load(options.directory, file, CommandType.Inhibitor);

			loaded.push(file.replace(".js", ""));
		}

		if (this.client.handlerOptions.inhibitors?.logging)
			console.info(
				`Xernerx | Loaded ${loaded.length} inhibitors: ${loaded.join(", ")}.`
			);
	}

	#readdir(dir: string) {
		try {
			return fs
				.readdirSync(path.resolve(dir))
				.filter((file) => file.endsWith(".js"));
		} catch (error) {
			console.error(`Xernerx | Couldn't read ${dir} because <${error}>.`);
		}
		return [];
	}

	async #load(dir: string, file: string, type: string) {
		try {
			dir.split(/\//).shift();

			let command = (await import("file://" + `${path.resolve(dir)}/${file}`))
				.default;

			command = new command();

			command.client = this.client;

			command.commandType = type;

			command.filepath = `${path.resolve(dir)}\\${file}`;

			command.file = file;

			if (type === CommandType.MessageCommand)
				this.client.commands.message.set(
					command?.name || command?.name,
					command
				);

			if (type === CommandType.SlashCommand) {
				this.client.commands.slash.set(
					command?.data?.name || command?.name,
					command
				);
			}

			if (type === CommandType.ContextCommand) {
				this.client.commands.context.set(
					command?.data?.name || command?.name,
					command
				);
			}

			if (type === CommandType.Event) {
				this.client.events.set(command.name, command);
			}

			if (type === CommandType.Inhibitor) {
				this.client.inhibitors.set(command.name, command);
			}

			return command?.data?.name || command?.name || command.id;
		} catch (error) {
			console.error(`Xernerx | Couldn't load ${file} because <${error}>.`);
		}
	}

	#emitter(event: any) {
		const client = this.client;

		if (event.emitter === "client") {
			if (event.once)
				client.once(event.name, (...args: any[]) => {
					event.run(...args);
				});
			else
				client.on(event.name, (...args: any[]) => {
					event.run(...args);
				});
		} else if (event.emitter === "rest") {
			if (event.once)
				client.once(event.name, (...args: any[]) => {
					event.run(...args);
				});
			else
				client.on(event.name, (...args: any[]) => {
					event.run(...args);
				});
		} else if (event.emitter === "process") {
			if (event.once)
				process.once(event.name, (...args: any[]) => {
					event.run(...args);
				});
			else
				process.on(event.name, (...args: any[]) => {
					event.run(...args);
				});
		}
	}
}
