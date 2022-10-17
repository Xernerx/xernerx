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
import { logStyle } from "../models/Functions.js";

/**
 * @description - The Handler class.
 * @param {XernerxClient} client - The XernerxClient.
 */
export class Handler {
	client: XernerxClient;
	commands: object[];

	constructor(client: XernerxClient) {
		this.client = client;

		this.commands = [];
	}

	/**
	 * @description - The loader for the message commands.
	 * @param {MessageCommandOptions} options - The options for the message command loader.
	 */
	loadAllMessageCommands(options: MessageCommandOptions) {
		this.client.handlerOptions.message = s
			.object({
				directory: s.string,
				prefix: s.union(s.string, s.array(s.string)),
				allowMention: s.boolean.default(false),
				cooldown: s.number.default(0),
				userPermissions: s.array(s.bigint).default([]),
				clientPermissions: s.array(s.bigint).default([]),
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
				logStyle(
					`Xernerx | Loaded ${loaded.length} message commands: ${loaded.join(
						", "
					)}.`,
					"text",
					"cyan"
				)
			);
	}

	/**
	 * @description - The loader for the slash commands.
	 * @param {SlashCommandOptions} options - The options for the slash command loader.
	 */
	loadAllSlashCommands(options: SlashCommandOptions) {
		this.client.handlerOptions.slash = s
			.object({
				directory: s.string,
				guildId: s.string,
				global: s.boolean,
				cooldown: s.number.default(0),
				userPermissions: s.array(s.bigint).default([]),
				clientPermissions: s.array(s.bigint).default([]),
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
				logStyle(
					`Xernerx | Loaded ${loaded.length} slash commands: ${loaded.join(
						", "
					)}.`,
					"text",
					"cyan"
				)
			);
	}

	/**
	 * @description - The loader for the context commands.
	 * @param {ContextCommandOptions} options - The options for the context command loader.
	 */
	loadAllContextCommands(options: ContextCommandOptions) {
		this.client.handlerOptions.context = s
			.object({
				directory: s.string,
				guildId: s.string,
				global: s.boolean,
				cooldown: s.number.default(0),
				userPermissions: s.array(s.bigint).default([]),
				clientPermissions: s.array(s.bigint).default([]),
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
				logStyle(
					`Xernerx | Loaded ${loaded.length} context commands: ${loaded.join(
						", "
					)}.`,
					"text",
					"cyan"
				)
			);
	}

	/**
	 * @description - The loader for the events.
	 * @param {EventLoadOptions} options - The options for the event loader.
	 */
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
					console.error(
						logStyle(
							`Xernerx | Couldn't load ${file} because <${error}>`,
							"background",
							"red"
						)
					);
				}

				loaded.push(file.replace(".js", ""));
			}

			if (this.client.handlerOptions.events?.logging)
				console.info(
					logStyle(
						`Xernerx | Loaded ${loaded.length} events: ${loaded.join(", ")}.`,
						"text",
						"cyan"
					)
				);
		})();
	}

	/**
	 * @description - The loader for the inhibitors.
	 * @param {InhibitorLoadOptions} options - The options for the inhibitor loader.
	 */
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
				logStyle(
					`Xernerx | Loaded ${loaded.length} inhibitors: ${loaded.join(", ")}.`,
					"text",
					"cyan"
				)
			);
	}

	/**
	 * @description - a reader for directories
	 * @param {string} dir - the directory to look for.
	 * @returns array of files.
	 */
	#readdir(dir: string) {
		try {
			return fs
				.readdirSync(path.resolve(dir))
				.filter((file) => file.endsWith(".js"));
		} catch (error) {
			console.error(
				logStyle(
					`Xernerx | Couldn't read ${dir} because <${error}>.`,
					"background",
					"red"
				)
			);
		}
		return [];
	}

	/**
	 * @description file loader.
	 * @param {string} dir - the directory.
	 * @param {string} file - the file in the directory.
	 * @param {string} type - the type of file.
	 * @returns undefined
	 */
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
			console.error(
				logStyle(
					`Xernerx | Couldn't load ${file} because <${error}>.`,
					"background",
					"red"
				)
			);
		}
	}

	/**
	 * @description the event emitter to emit all events.
	 * @param {object} event - the event to be emitted.
	 * @returns void
	 */
	#emitter(event: {
		name: string;
		emitter: string;
		once: boolean;
		run: Function;
	}) {
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
