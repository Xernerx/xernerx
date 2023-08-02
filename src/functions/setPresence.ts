/** @format */

import XernerxClient from '../main.js';
import { PresenceOptions } from '../dhkdkhmfg/interfaces.js';

export default function setPresence(client: XernerxClient, options: PresenceOptions) {
	const presence = () =>
		client.user?.setPresence({
			activities: [
				{
					name: options.text,
					type: options.type,
					url: options.url,
				},
			],
			status: options.status,
		});

	let response = presence();

	if (options.interval)
		setInterval(() => {
			response = presence();
		}, options.interval);

	return response;
}
