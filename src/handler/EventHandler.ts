/** @format */

import sharpyy from 'sharpyy';

import { XernerxClient } from '../client/XernerxClient.js';
import { Handler } from './Handler.js';
import { XernerxSuccess } from '../tools/XernerxSuccess.js';

export class EventHandler extends Handler {
	constructor(client: XernerxClient) {
		super(client);
	}

	/**
	 * Loads a single event file.
	 *
	 * @param file - The path to the event file to be loaded.
	 * @returns A promise that resolves when the event file has been successfully loaded.
	 */
	public async loadEvent(file: string) {
		return this.loadFile(file);
	}

	/**
	 * Loads all event files from the specified directory and initializes them.
	 *
	 * @param options - An object containing options for loading events.
	 * @param options.directory - The directory path where event files are located.
	 * @returns A promise that resolves when all events have been loaded.
	 */
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
