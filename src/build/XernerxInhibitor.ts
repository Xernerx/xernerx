/** @format */

import { z } from 'zod';

import { XernerxInhibitorOptions, MessageCommandArguments, SlashCommandArguments, ContextCommandArguments } from '../types/interfaces.js';
import { InhibitorType, XernerxInteraction } from '../types/types.js';
import { XernerxClientType, XernerxMessage, XernerxMessageContextInteraction, XernerxSlashInteraction, XernerxUserContextInteraction } from '../types/extenders.js';
import { XernerxContextCommand, XernerxMessageCommand, XernerxSlashCommand } from '../main.js';

/**
 * @description - The inhibitor builder for inhibitors.
 * @param {String} id - The unique ID of the inhibitor.
 * @param {InhibitorOptions} options - The inhibitor options.
 */
export default class XernerxInhibitor {
	public declare readonly id;
	public declare readonly name;
	public declare readonly type: InhibitorType;
	public declare readonly filetype: 'Inhibitor';
	public declare readonly filepath: string;
	public declare readonly client: XernerxClientType;

	public constructor(id: string, options: XernerxInhibitorOptions) {
		this.id = id;

		z.object({
			name: z.string(),
			type: z.string(),
		}).parse(options);

		this.name = options.name;

		this.type = options.type;

		this.client = this.client;
	}

	public pre(interaction: XernerxMessage | XernerxInteraction<XernerxSlashInteraction | XernerxUserContextInteraction | XernerxMessageContextInteraction>, args: any) {}

	/**
	 * @description The check rule
	 * @param interaction - The interaction with the inhibitor, can be message and interaction
	 * @param args - The arguments parsed with this command
	 */
	public async check<T extends XernerxMessage | XernerxInteraction<XernerxSlashInteraction | XernerxUserContextInteraction | XernerxMessageContextInteraction>>(
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
	): Promise<any> {}

	public async post<T extends XernerxMessage | XernerxInteraction<XernerxSlashInteraction | XernerxUserContextInteraction | XernerxMessageContextInteraction>>(
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
	): Promise<any> {}
}
