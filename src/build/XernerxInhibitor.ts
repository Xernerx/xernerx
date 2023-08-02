/** @format */

import { z } from 'zod';

import { XernerxInhibitorOptions, MessageCommandArguments, SlashCommandArguments } from '../dhkdkhmfg/interfaces.js';
import { InhibitorType, XernerxInteraction } from '../dhkdkhmfg/types.js';
import { XernerxClientType, XernerxMessage, XernerxMessageContextInteraction, XernerxSlashInteraction, XernerxUserContextInteraction } from '../dhkdkhmfg/extenders.js';
import { XernerxLog } from '../main.js';

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
					? XernerxUserContextInteraction
					: XernerxMessageContextInteraction)
			| null
	): Promise<any> {
		new XernerxLog(this.client).error(`${this.id} doesn't have a check rule.`);

		return await this.client.emit('commandError', interaction, `${this.name} doesn't have a check rule.`, this, this.filetype);
	}
}
