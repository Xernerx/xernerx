/** @format */

import { BaseHandler } from './BaseHandler.js';
import { InhibitorHandlerOptions } from '../interfaces/InhibitorHandlerOptions.js';
import { XernerxClient } from '../client/XernerxClient.js';
import { XernerxSuccess } from '../tools/XernerxSuccess.js';
import sharpyy from 'sharpyy';

export class InhibitorHandler extends BaseHandler {
	constructor(client: XernerxClient) {
		super(client);
	}

	async loadInhibitor(file: string) {
		return await this.loadFile(file);
	}

	async loadInhibitors(options: InhibitorHandlerOptions) {
		const files = this.loadFiles(options.directory);

		for (const file of files) {
			await this.loadInhibitor(file);
		}

		new XernerxSuccess(`Loaded inhibitors: ${this.client.inhibitors.map((inhibitor) => sharpyy(inhibitor.id, 'txYellow')).join(', ')}`);
	}
}
