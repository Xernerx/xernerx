import XernerxClient from "../client/XernerxClient.js";
import fs from "node:fs";
import * as path from "path";
import { CommandType } from "../types/Types.js";
import {
	ContextCommandOptions,
	EventOptions,
	MessageCommandOptions,
	SlashCommandOptions,
	Event,
	InhibitorOptions,
} from "../interfaces/HandlerInterfaces.js";

export class Handler {
	client: XernerxClient;
	commands: object[];

	constructor(client: XernerxClient) {
		this.client = client;

		this.commands = [];
	}

	loadAllMessageCommands(options: MessageCommandOptions) {
		const files = this.#readdir(options.directory);

		this.client.handlerOptions.message = options;

		for (const file of files) {
			this.#load(options.directory, file, CommandType.MessageCommand);
		}
	}

	loadAllSlashCommands(options: SlashCommandOptions) {
		const files = this.#readdir(options.directory);

		this.client.handlerOptions.slash = options;

		for (const file of files) {
			this.#load(options.directory, file, CommandType.SlashCommand);
		}
	}

	loadAllContextCommands(options: ContextCommandOptions) {
		const files = this.#readdir(options.directory);

		this.client.handlerOptions.context = options;

		for (const file of files) {
			this.#load(options.directory, file, CommandType.ContextCommand);
		}
	}

	loadAllEvents(options: EventOptions) {
		const files = this.#readdir(options.directory);

		this.client.handlerOptions.events = options;

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

	loadAllInhibitors(options: InhibitorOptions) {
		const files = this.#readdir(options.directory);

		this.client.handlerOptions.inhibitors = options;

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

			if (type === CommandType.Inhibitor) {
				this.client.inhibitors.set(command.name, command);
			}
		} catch (error: any) {
			console.error(`Couldn't load ${file} because <${error.stack}>`);
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
