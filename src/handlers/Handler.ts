/** @format */

import * as fs from 'fs';
import * as path from 'path';

import XernerxClient from '../client/XernerxClient.js';
import load from '../functions/load.js';
import MessageCommandBuilder from '../build/XernerxMessageCommand.js';
import XernerxSlashCommand from '../build/XernerxSlashCommand.js';
import XernerxContextCommand from '../build/XernerxContextCommand.js';
import { filetype } from '../types/types.js';
import { RestEvents, XernerxClientEvents, XernerxEvent, XernerxInhibitor } from '../main.js';

export default class Handler {
	public readonly client;
	public readonly files: Array<MessageCommandBuilder | XernerxSlashCommand | XernerxContextCommand>;

	constructor(client: XernerxClient) {
		this.client = client;

		this.files = [];
	}

	public readdir(dir: string) {
		try {
			return fs.readdirSync(path.resolve(dir)).filter((file) => file.endsWith('.js'));
		} catch (error) {
			console.error(error);
		}
		return [];
	}

	public async load(filepath: string, type: filetype) {
		const file = await load(this.client, filepath, type);

		this.files.push(file);

		return file;
	}

	/**
	 * Emits a file that has been loaded into the handler.
	 * @param file - The file to emit.
	 */
	public async emit<File extends { name: string; filetype: 'MessageCommand' | 'SlashCommand' | 'ContextCommand'; run: Function } | XernerxInhibitor | XernerxEvent<keyof XernerxClientEvents>>(
		file: File
	): Promise<void> {
		if (!file?.filetype) return;

		if (file.filetype === 'Inhibitor') return;

		if (file.filetype === 'Event' && file.emitter) {
			if (file.emitter === 'client') {
				this.client[file.once ? 'once' : 'on'](file.name, <T extends keyof XernerxClientEvents>(...args: XernerxClientEvents[T][]) => file.run(...(args as XernerxClientEvents[T])));
			} else if (file.emitter === 'process') {
				process[file.once ? 'once' : 'on'](file.name, (...args) => file.run(...(args as never)));
			} else if (file.emitter === 'rest') {
				this.client.rest[file.once ? 'once' : 'on'](file.name as keyof RestEvents, (...args) => file.run(...(args as never)));
			} else {
				// @ts-expect-error
				this.client[file.emitter as string][file.once ? 'once' : 'on'](file.name, (...args) => file.run(...(args as never)));
			}
		} else {
			this.client.on(file.name, (...args) => file.run(...(args as never)));
		}
	}
}
