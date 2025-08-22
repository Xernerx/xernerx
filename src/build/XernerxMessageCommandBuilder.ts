/** @format */

import { XernerxWarn } from '../tools/XernerxWarn.js';
import { XernerxMessageCommandBuilderOptions } from '../interfaces/XernerxMessageCommandBuilderOptions.js';
import { XernerxBaseBuilder } from './XernerxBaseBuilder.js';
import { z } from 'zod';

export class XernerxMessageCommandBuilder extends XernerxBaseBuilder {
	declare public readonly filetype: 'XernerxMessageCommand';
	declare public readonly name: string;
	declare public readonly description: string;
	declare public readonly alias: string[];
	declare public readonly prefix: string[];

	constructor(id: string, options: XernerxMessageCommandBuilderOptions) {
		super(id, options);

		options = z
			.object({
				name: z.string(),
				alias: z.union([z.string(), z.array(z.string())]).default([]),
				prefix: z.union([z.string(), z.array(z.string())]).default([]),
			})
			.parse(options);

		this.name = options.name;

		this.alias = typeof options.alias == 'string' ? [options.alias] : (options.alias as Array<string>);

		this.prefix = typeof options.prefix == 'string' ? [options.prefix] : (options.prefix as Array<string>);

		this.filetype = 'XernerxMessageCommand';
	}

	public async exec(...args: any[]): Promise<any> {
		new XernerxWarn(`${this.id} has no exec function, command will not respond.`);
	}
}
