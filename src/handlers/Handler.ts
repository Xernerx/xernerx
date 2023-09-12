/** @format */

import * as fs from 'fs';
import * as path from 'path';

import XernerxClient from '../client/XernerxClient.js';
import load from '../functions/load.js';
import MessageCommandBuilder from '../build/XernerxMessageCommand.js';
import XernerxSlashCommand from '../build/XernerxSlashCommand.js';
import XernerxContextCommand from '../build/XernerxContextCommand.js';
import { filetype } from '../types/types.js';

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

	public async emit<T extends Record<string, string | boolean | Function | void>>(event: T) {
		if (!event?.filetype) return;

		if (event.filetype === 'Event') {
			if (event.emitter === 'client')
				event.once
					? this.client.once(event.name as string, <T extends Array<T>>(...args: T) => (event.run as Function)(...args))
					: this.client.on(event.name as string, <T extends Array<T>>(...args: T) => (event.run as Function)(...args));
			else if (event.emitter === 'process')
				event.once
					? process.once(event.name as string, <T extends Array<T>>(...args: T) => (event.run as Function)(...args))
					: process.on(event.name as string, <T extends Array<T>>(...args: T) => (event.run as Function)(...args));
		}

		if (['MessageCommand', 'SlashCommand', 'ContextCommand'].includes(event.filetype as string)) {
			event.once
				? this.client.once(event.name as string, <T extends Array<T>>(...args: T) => (event.run as Function)(...args))
				: this.client.on(event.name as string, <T extends Array<T>>(...args: T) => (event.run as Function)(...args));
		}
	}
}
