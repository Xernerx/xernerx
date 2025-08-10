/** @format */
import fs from 'fs';
import path from 'path';

import { XernerxClient } from '../client/XernerxClient.js';
import { XernerxError } from '../tools/XernerxError.js';
import { XernerxEventBuilder } from '../build/XernerxEventBuilder.js';
import { XernerxMessageCommandBuilder } from '../build/XernerxMessageCommandBuilder.js';
import { XernerxSlashCommandBuilder } from '../main.js';

export class Handler {
	declare public readonly client: XernerxClient;
	[index: string]: Record<string, any>;

	constructor(client: XernerxClient) {
		this.client = client;
	}

	loadFiles(dir: string) {
		try {
			return fs
				.readdirSync(dir)
				.filter((file) => file.endsWith('.js'))
				.map((file) => path.join(dir, file));
		} catch (error) {
			new XernerxError((error as Error).message, 0);

			return [];
		}
	}

	async loadFile(file: string) {
		const filepath = path.resolve(file);
		const filename = path.basename(filepath);

		try {
			const file = await import(`file://${filepath}`);

			if (!file.default) return new XernerxError(`${filename} | ${file} does not have a default export.`, 0);

			const builder = new file.default(this.client);

			builder.filepath = filepath;
			builder.filename = filename;

			this.importFile(builder);
		} catch (error) {
			new XernerxError(`${filename} | ${(error as Error).message}`, 0);
		}
	}

	async importFile(builder: XernerxEventBuilder | XernerxMessageCommandBuilder | XernerxSlashCommandBuilder, filename?: string) {
		if (builder.filetype === 'XernerxEvent') {
			if (this.client.events.has(builder.id)) return new XernerxError(`${filename} | ID must be unique`);

			this.client.events.set(builder.id, builder);

			builder.once
				? this[(builder as XernerxEventBuilder).emitter].once(builder.name, <T extends []>(...args: T) => builder.run(...(args as [])))
				: this[(builder as XernerxEventBuilder).emitter].on(builder.name, <T extends []>(...args: T) => builder.run(...(args as [])));
		}

		if (builder.filetype === 'XernerxMessageCommand') {
			this.client.commands.message.set(builder.id, builder);
		}

		if (builder.filetype === 'XernerxSlashCommand') {
			this.client.commands.slash.set(builder.id, builder);
		}

		return builder;
	}
}
