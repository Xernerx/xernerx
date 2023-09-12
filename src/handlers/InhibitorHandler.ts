/** @format */

import { z } from 'zod';

import * as path from 'path';

import XernerxClient from '../client/XernerxClient.js';
import Handler from './Handler.js';
import { InhibitorHandlerOptions } from '../types/interfaces.js';
import XernerxLog from '../tools/XernerxLog.js';
import { Style } from 'dumfunctions';

export default class InhibitorHandler extends Handler {
	public declare readonly readyTimestamp;

	constructor(client: XernerxClient) {
		super(client);

		this.readyTimestamp = Number(Date.now());
	}

	public async loadInhibitors(options: InhibitorHandlerOptions) {
		const inhibitors = [];

		options = z
			.object({
				directory: z.string(),
			})
			.parse(options);

		this.client.modules.options.inhibitors = options;

		const files = this.readdir(options.directory);

		for (const file of files) {
			const filepath = `${path.resolve(options.directory)}\\${file}`;

			const inhibitor = await this.load(filepath, 'Inhibitor');

			this.emit(inhibitor);

			inhibitors.push(inhibitor.id);
		}

		new XernerxLog(this.client).info(
			`Loaded ${Style.log(String(this.client.inhibitors.size), { color: Style.TextColor.Cyan })} Inhibitors: ${inhibitors
				.map((inhibitor) => Style.log(inhibitor, { color: Style.TextColor.LightYellow }))
				.join(', ')}`
		);
	}
}
