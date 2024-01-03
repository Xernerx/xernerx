/** @format */

import { Style } from 'dumfunctions';

import XernerxExtensionBuilder from 'xernerx-extension-builder';
import XernerxClient from '../client/XernerxClient.js';
import Handler from './Handler.js';
import XernerxLog from '../tools/XernerxLog.js';

export default class ExtensionHandler extends Handler {
	public declare readonly readyTimestamp;

	constructor(client: XernerxClient) {
		super(client);

		this.readyTimestamp = Number(Date.now());
	}

	loadExtensions(...extensions: Array<XernerxExtensionBuilder>) {
		const active = extensions.map((extension) => {
			try {
				if (extension.main) extension.main(this.client);

				if (extension.defer) {
					this.client.on('ready', (client) => extension.defer(client));
				}

				return extension.name;
			} catch (error) {
				return new XernerxLog(this.client).error(`An error occurred while loading ${Style.log(extension.name, { color: Style.TextColor.Red })}`, error);
			}
		});

		new XernerxLog(this.client).info(
			`Loaded ${Style.log(String(extensions.length), { color: Style.TextColor.Cyan })} Extensions: ${active
				.filter((e) => e)
				.map((event) => Style.log(event as string, { color: Style.TextColor.LightYellow }))
				.join(', ')}`
		);
	}
}
