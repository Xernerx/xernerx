/** @format */

import sharpyy from 'sharpyy';

import { XernerxClient } from '../client/XernerxClient.js';
import { Handler } from './Handler.js';
import { XernerxSuccess } from '../tools/XernerxSuccess.js';

export class EventHandler extends Handler {
	constructor(client: XernerxClient) {
		super(client);
	}

	public async loadEvent(file: string) {
		return this.loadFile(file);
	}

	public async loadEvents(options: { directory: string }) {
		const files = this.loadFiles(options.directory);

		for (const file of files) {
			await this.loadEvent(file);
		}

		new XernerxSuccess(
			`Loaded events: ${this.client.events
				.filter((event) => !event.id.startsWith('Xernerx'))
				.map((event) => sharpyy(event.id, 'txYellow'))
				.join(', ')}`
		);
	}
}
