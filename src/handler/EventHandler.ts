/** @format */

import { BaseHandler } from './BaseHandler.js';
import { EventHandlerOptions } from '../interfaces/EventHandlerOptions.js';
import { XernerxClient } from '../client/XernerxClient.js';
import { XernerxClientReadyEvent } from '../events/clientReady.js';
import { XernerxMessageEvent } from '../events/XernerxMessage.js';
import { XernerxSuccess } from '../tools/XernerxSuccess.js';
import sharpyy from 'sharpyy';

export class EventHandler extends BaseHandler {
	constructor(client: XernerxClient) {
		super(client);

		this.loadBuilder(XernerxMessageEvent, XernerxClientReadyEvent);
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
	public async loadEvents(options: EventHandlerOptions) {
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
