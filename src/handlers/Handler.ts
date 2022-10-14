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

		const files = this.#readdir(options.directory);

		for (const file of files) {
			this.#load(options.directory, file, CommandType.MessageCommand);
		}
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
			})
			.parse(options);

		const files = this.#readdir(options.directory);

		for (const file of files) {
			this.#load(options.directory, file, CommandType.SlashCommand);
		}
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
			})
			.parse(options);

		const files = this.#readdir(options.directory);

		for (const file of files) {
			this.#load(options.directory, file, CommandType.ContextCommand);
		}
	}

	loadAllEvents(options: EventLoadOptions) {
		this.client.handlerOptions.events = s
			.object({
				directory: s.string,
				logging: s.boolean.default(false),
			})
			.parse(options);

		const files = this.#readdir(options.directory);

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
					console.error(error);
				}
			}
		})();
	}

	loadAllInhibitors(options: InhibitorLoadOptions) {
		this.client.handlerOptions.inhibitors = s
			.object({
				directory: s.string,
				logging: s.boolean.default(false),
			})
			.parse(options);

		const files = this.#readdir(options.directory);

		for (const file of files) {
			this.#load(options.directory, file, CommandType.Inhibitor);
		}
	}

	#readdir(dir: string) {
		return fs
			.readdirSync(path.resolve(dir))
			.filter((file) => file.endsWith(".js"));
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
		} catch (error) {
			console.error(`Couldn't load ${file} because <${error}>`);
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
		}
	}
}
