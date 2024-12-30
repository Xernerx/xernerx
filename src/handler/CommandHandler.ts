/** @format */

import { XernerxClient } from '../main.js';
import { XernerxLog } from '../tools/XernerxLog.js';
import { XernerxMessageCommandHandlerOptions } from '../types/interfaces.js';
import { Handler } from './Handler.js';
import * as path from 'path';
import sharpyy from 'sharpyy';
import { XernerxMessageCreate } from '../events/messageCreate.js';

export class CommandHandler extends Handler {
	constructor(client: XernerxClient) {
		super(client);
	}

	public async loadMessageCommands(options: XernerxMessageCommandHandlerOptions) {
		try {
			await this.client.util.delay(options.delay || 0);

			XernerxLog.debug(`Loading commands from: ${options.directory}...`);

			const dir = this.readdir(options.directory);

			for (const file of dir) {
				XernerxLog.debug(`Loading event: ${file}`);

				const filepath = path.resolve(options.directory, file);

				const builder = await this.load(filepath);

				builder;
			}

			await this.on(XernerxMessageCreate);

			this.client.modules.options.commands.message = options;

			XernerxLog.info(`Loaded message commands: ${this.client.collections.commands.message.map((command) => sharpyy(command.name, 'txYellow')).join(', ')}`);
		} catch (error) {
			XernerxLog.error('Failed to load message commands.', error as Error);
		}
	}
}
