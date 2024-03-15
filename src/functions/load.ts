/** @format */

import XernerxInhibitor from '../build/XernerxInhibitor.js';
import XernerxSlashCommand from '../build/XernerxSlashCommand.js';
import XernerxContextCommand from '../build/XernerxContextCommand.js';
import MessageCommandBuilder from '../build/XernerxMessageCommand.js';
import XernerxEvent from '../build/XernerxEvent.js';
import XernerxClient from '../client/XernerxClient.js';
import { filetype } from '../types/types.js';
import XernerxLog from '../tools/XernerxLog.js';
import { XernerxClientEvents } from '../main.js';

export default async function load(client: XernerxClient, path: string, type: filetype) {
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

function fileSave(client: XernerxClient, file: MessageCommandBuilder | XernerxSlashCommand | XernerxContextCommand | XernerxEvent<keyof XernerxClientEvents> | XernerxInhibitor, type: filetype) {
	switch (type) {
		case 'MessageCommand':
			client.commands.message.set(file.name, file as MessageCommandBuilder);
			break;
		case 'SlashCommand':
			client.commands.slash.set(file.name, file as XernerxSlashCommand);
			break;
		case 'ContextCommand':
			client.commands.context.set(file.name, file as XernerxContextCommand);
			break;
		case 'Inhibitor':
			client.inhibitors.set(file.name, file as XernerxInhibitor);
			break;
		case 'Event':
			client.events.set(file.name, file as XernerxEvent<keyof XernerxClientEvents>);
			break;
	}
}
