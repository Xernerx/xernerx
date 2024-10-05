/** @format */

/**
 * @module Handler
 * @category Core
 * @description Represents a handler for handling commands.
 */

import { XernerxClient } from '../client/XernerxClient.js';
import { XernerxContextCommandHandlerOptions, XernerxMessageCommandHandlerOptions, XernerxSlashCommandHandlerOptions } from '../types/interfaces.js';
import { Handler } from './Handler.js';
import path from 'path';

export class CommandHandler extends Handler {
	constructor(client: XernerxClient) {
		super(client);
	}

	protected async loadSlashCommands(options: XernerxSlashCommandHandlerOptions) {
		if (!this.client.modules.options.slash) this.client.modules.options.slash = {};
		this.client.modules.options.slash.global = options.global ?? this.client.settings.global;

		for (const file of await this.readdir(options.directory)) {
			const command = await this.load(path.resolve(`${options.directory}/${file}`));

			if (!command) continue;

			if (command.filetype == 'XernerxMessageCommand' || command.filetype == 'XernerxSlashCommand' || command.filetype == 'XernerxContextCommand') {
				if (!this.client.modules.options.slash.global) this.client.commands.stats.slash.local++;
				else if (!command.global) this.client.commands.stats.slash.local++;
				else this.client.commands.stats.slash.global++;
			}
		}
	}
	/**
	 * Loads message commands from the specified directory.
	 *
	 * This method iterates through the files in the given directory,
	 * attempts to load each file as a message command, and updates the
	 * command statistics accordingly.
	 *
	 * @param options - The options for loading message commands.
	 * @param options.directory - The directory from which to load message commands.
	 *
	 * @returns {Promise<void>} - A promise that resolves when all message commands have been loaded.
	 */
	protected async loadMessageCommands(options: XernerxMessageCommandHandlerOptions) {}
	protected async loadContextCommands(options: XernerxContextCommandHandlerOptions) {}
}
