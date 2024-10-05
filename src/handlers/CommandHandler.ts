/** @format */

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
	protected async loadMessageCommands(options: XernerxMessageCommandHandlerOptions) {}
	protected async loadContextCommands(options: XernerxContextCommandHandlerOptions) {}
}
