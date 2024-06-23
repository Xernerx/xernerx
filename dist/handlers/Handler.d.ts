/** @format */
import XernerxClient from '../client/XernerxClient.js';
import MessageCommandBuilder from '../build/XernerxMessageCommand.js';
import XernerxSlashCommand from '../build/XernerxSlashCommand.js';
import XernerxContextCommand from '../build/XernerxContextCommand.js';
import { filetype } from '../types/types.js';
import { XernerxClientEvents, XernerxEvent, XernerxInhibitor } from '../main.js';
export default class Handler {
	readonly client: XernerxClient<unknown>;
	readonly files: Array<MessageCommandBuilder | XernerxSlashCommand | XernerxContextCommand>;
	constructor(client: XernerxClient);
	readdir(dir: string, type: string): Promise<string[]>;
	load(filepath: string, type: filetype): Promise<any>;
	/**
	 * Emits a file that has been loaded into the handler.
	 * @param file - The file to emit.
	 */
	emit<
		File extends
			| {
					name: string;
					filetype: 'MessageCommand' | 'SlashCommand' | 'ContextCommand';
					run: Function;
			  }
			| XernerxInhibitor
			| XernerxEvent<keyof XernerxClientEvents>,
	>(file: File): Promise<void>;
}
