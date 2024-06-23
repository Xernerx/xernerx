/** @format */
import { XernerxInhibitorOptions, MessageCommandArguments, SlashCommandArguments, ContextCommandArguments } from '../types/interfaces.js';
import { InhibitorType, XernerxInteraction } from '../types/types.js';
import { XernerxClientType, XernerxMessage, XernerxMessageContextInteraction, XernerxSlashInteraction, XernerxUserContextInteraction } from '../types/extenders.js';
import XernerxContextCommand from '../build/XernerxContextCommand.js';
import XernerxSlashCommand from '../build/XernerxSlashCommand.js';
import XernerxMessageCommand from '../build/XernerxMessageCommand.js';
/**
 * @description - The inhibitor builder for inhibitors.
 * @param {String} id - The unique ID of the inhibitor.
 * @param {InhibitorOptions} options - The inhibitor options.
 */
export default class XernerxInhibitor {
	readonly id: string;
	readonly name: string;
	readonly type: InhibitorType;
	readonly filetype: 'Inhibitor';
	readonly filepath: string;
	readonly client: XernerxClientType;
	constructor(id: string, options: XernerxInhibitorOptions);
	pre(interaction: XernerxMessage | XernerxInteraction<XernerxSlashInteraction | XernerxUserContextInteraction | XernerxMessageContextInteraction>, args: any): void;
	/**
	 * @description The check rule
	 * @param interaction - The interaction with the inhibitor, can be message and interaction
	 * @param args - The arguments parsed with this command
	 */
	check<T extends XernerxMessage | XernerxInteraction<XernerxSlashInteraction | XernerxUserContextInteraction | XernerxMessageContextInteraction>>(
		interaction: XernerxMessage | XernerxInteraction<XernerxSlashInteraction | XernerxUserContextInteraction | XernerxMessageContextInteraction>,
		args:
			| (T extends XernerxMessage
					? MessageCommandArguments
					: T extends XernerxSlashInteraction
					? SlashCommandArguments
					: T extends XernerxUserContextInteraction
					? ContextCommandArguments<'user' | 'message'>
					: never)
			| null,
		command: XernerxSlashCommand | XernerxMessageCommand | XernerxContextCommand
	): Promise<any>;
	post<T extends XernerxMessage | XernerxInteraction<XernerxSlashInteraction | XernerxUserContextInteraction | XernerxMessageContextInteraction>>(
		interaction: XernerxMessage | XernerxInteraction<XernerxSlashInteraction | XernerxUserContextInteraction | XernerxMessageContextInteraction>,
		args:
			| (T extends XernerxMessage
					? MessageCommandArguments
					: T extends XernerxSlashInteraction
					? SlashCommandArguments
					: T extends XernerxUserContextInteraction
					? ContextCommandArguments<'user' | 'message'>
					: never)
			| null,
		command: XernerxSlashCommand | XernerxMessageCommand | XernerxContextCommand
	): Promise<any>;
}
