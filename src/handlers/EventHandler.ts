/** @format */

import { z } from 'zod';

import * as path from 'path';

import XernerxClient from '../client/XernerxClient.js';
import { EventHandlerOptions } from '../dhkdkhmfg/interfaces.js';
import Handler from './Handler.js';
import XernerxLog from '../tools/XernerxLog.js';
import { Style } from 'dumfunctions';

export default class EventHandler extends Handler {
	constructor(client: XernerxClient) {
		super(client);
	}

	public async loadEvents(options: EventHandlerOptions) {
		options = z
			.object({
				directory: z.string(),
			})
			.parse(options);

		this.client.modules.options.events = options;

		const files = this.readdir(options.directory);

		for (const file of files) {
			const filepath = `${path.resolve(options.directory)}\\${file}`;

			const data = await this.load(filepath, 'Event');

			this.emit(data);
		}

		new XernerxLog(this.client).info(`Loaded ${Style.log(String(this.client.events.size), { color: Style.TextColor.Cyan })} Events.`);
	}
}
