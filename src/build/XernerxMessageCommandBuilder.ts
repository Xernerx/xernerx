/** @format */

import { XernerxMessageCommandBuilderOptions } from '../types/interfaces.js';
import { XernerxBaseBuilder } from './XernerxBaseBuilder.js';
import { XernerxMessage } from '../main.js';

export class XernerxMessageCommandBuilder extends XernerxBaseBuilder {
	declare public readonly prefix;
	declare public readonly aliases;
	declare public readonly collection;
	declare public readonly filetype;

	constructor(id: string, options: XernerxMessageCommandBuilderOptions) {
		super(id, options);

		this.prefix = (typeof options.prefix === 'string' ? [options.prefix] : options.prefix) || [];

		this.aliases = (typeof options.aliases === 'string' ? [options.aliases] : options.aliases) || [];

		this.collection = 'commands.message';

		this.filetype = 'XernerxSlashCommand';
	}

	async exec(message: XernerxMessage) {}
}
