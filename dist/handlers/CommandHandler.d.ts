/** @format */
import XernerxClient from '../client/XernerxClient.js';
import { ContextHandlerOptions, MessageHandlerOptions, SlashHandlerOptions } from '../types/interfaces.js';
import Handler from './Handler.js';
export default class CommandHandler extends Handler {
	readonly readyTimestamp: number;
	constructor(client: XernerxClient);
	loadMessageCommands(options: MessageHandlerOptions): Promise<void>;
	loadSlashCommands(options: SlashHandlerOptions): Promise<void>;
	loadContextCommands(options: ContextHandlerOptions): Promise<void>;
	private messageCommandRun;
	private slashCommandRun;
	private contextCommandRun;
	private exec;
	private _checks;
}
