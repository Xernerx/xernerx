/** @format */
import { ActivityType } from 'discord.js';
import { Style } from 'dumfunctions';
export default function setPresence(client, options) {
	const presence = () =>
		client.user?.setPresence({
			activities: [
				{
					name: options.text,
					type: ActivityType[Style.titleCase(options.type || 'Custom')],
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
