/** @format */

import XernerxClient from '../client/XernerxClient.js';

enum filetypes {
	'message' = 'MessageCommand',
	'slash' = 'SlashCommand',
	'context' = 'ContextCommand',
	'event' = 'Event',
	'inhibitor' = 'Inhibitor',
}

export default function reload(client: XernerxClient, type: 'message' | 'slash' | 'context' | 'event' | 'inhibitor') {
	const files: Array<string> = [];

	if (type === 'message' || type === 'slash' || type === 'context') {
		for (const [name] of client.commands[type]) {
			files.push((client.commands[type].get(name) as unknown as Record<string, string>).filepath);
		}

		(client.commands[type].sweep as Function)(() => true);
	}

	if (type === 'event') {
		for (const [name] of client.events) {
			files.push((client.events.get(name) as unknown as Record<string, string>).filepath);
		}

		(client.events.sweep as Function)(() => true);
	}

	if (type === 'inhibitor') {
		for (const [name] of client.inhibitors) {
			files.push((client.inhibitors.get(name) as unknown as Record<string, string>).filepath);
		}

		(client.inhibitors.sweep as Function)(() => true);
	}

	return files.map(async (file) => {
		let filedata = new (await import(`file://${file}`)).default();

		filedata.filetype = filetypes[type];

		filedata.filepath = file;

		filedata.client = client;

		if (type === 'message' || type === 'slash' || type === 'context') client.commands[type].set(filedata.name, filedata);

		if (type === 'event') client.events.set(filedata.name, filedata);

		if (type === 'inhibitor') client.inhibitors.set(filedata.name, filedata);

		return filedata;
	});
}
