/** @format */
// import * as inquirer from '@inquirer/prompts';
// import { link } from 'sharpyy';

import { XernerxClient } from '../client/XernerxClient.js';
import * as fs from 'fs';
import * as path from 'path';

import { XernerxFile } from '../types/types.js';
import XernerxLog from '../tools/XernerxLog.js';
import { link } from 'sharpyy';

export class Handler {
	public declare readonly client: XernerxClient;

	constructor(client: XernerxClient) {
		this.client = client;
	}

	protected async readdir(directory: string) {
		const dirpath = path.resolve(directory);

		if (this.client.settings.debug) XernerxLog.debug(`Attempting to read directory ${link(directory, new URL(dirpath))}`);

		try {
			const files = fs.readdirSync(dirpath);

			return files.filter((file) => file.endsWith('.js') || file.endsWith('.mjs') || file.endsWith('.cjs'));
		} catch (error) {
			XernerxLog.error(`Error reading directory ${link(directory, new URL(dirpath))}:`, error as Error);
			return [];
		}
	}

	protected async load(filepath: string) {
		if (this.client.settings.debug) XernerxLog.debug(`Attempting to load ${link(filepath, new URL(filepath))}`);

		try {
			const file = ((await import(`file://${filepath}`))?.default || (await import(`file://${filepath}`))) as XernerxFile;

			const openFile = new (file as any)() as XernerxFile;

			const [collection, group] = openFile.collection.split('.');

			group
				? this.client[group as 'commands'][collection as 'message' | 'slash' | 'context'].set(openFile._id, openFile as never)
				: this.client[collection as 'events' | 'inhibitors'].set(openFile._id, openFile as never);

			if (this.client.settings.debug) XernerxLog.debug(`Loaded ${link(openFile._id, new URL(filepath))}`);

			return openFile as XernerxFile;
		} catch (error) {
			XernerxLog.error(`Error loading ${link(filepath, new URL(filepath))}:`, error as Error);
			return null;
		}
	}
}
