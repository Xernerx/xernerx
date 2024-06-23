/** @format */
import XernerxLog from '../tools/XernerxLog.js';
export default async function load(client, path, type) {
	try {
		let file = new (await import(`file://${path}`)).default();
		file.filetype = type;
		file.filepath = path;
		file.client = client;
		file.util = {};
		fileSave(client, file, type);
		return file;
	} catch (error) {
		new XernerxLog(client).error(`Couldn't load ${type} ${path.match(/\w*\.js$/gim)?.at(0) || path}`, error);
	}
}
function fileSave(client, file, type) {
	switch (type) {
		case 'MessageCommand':
			client.commands.message.set(file.name, file);
			break;
		case 'SlashCommand':
			client.commands.slash.set(file.name, file);
			break;
		case 'ContextCommand':
			client.commands.context.set(file.name, file);
			break;
		case 'Inhibitor':
			client.inhibitors.set(file.name, file);
			break;
		case 'Event':
			client.events.set(file.name, file);
			break;
	}
}
