/** @format */

import { ActivityType } from 'discord.js';
import { Style } from 'dumfunctions';
import XernerxClient from '../main.js';
import { PresenceOptions } from '../types/interfaces.js';

export default function setPresence(client: XernerxClient, options: PresenceOptions) {
	const presence = () =>
		client.user?.setPresence({
			activities: [
				{
					name: options.text,
					type: ActivityType[Style.titleCase(options.type || 'Custom') as keyof typeof ActivityType],
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
