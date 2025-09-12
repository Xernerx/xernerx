/** @format */

import { z } from 'zod';

import { XernerxWarn } from '../tools/XernerxWarn.js';
import { XernerxMessageCommandBuilderOptions } from '../interfaces/XernerxMessageCommandBuilderOptions.js';
import { XernerxBaseBuilder } from './XernerxBaseBuilder.js';
import { ChannelType, Permissions } from 'discord.js';

export class XernerxMessageCommandBuilder extends XernerxBaseBuilder {
	// Discord
	declare public readonly name: string;
	declare public readonly description: string;
	declare public readonly alias: Array<string>;
	declare public readonly prefix: Array<string>;
	declare public readonly premium?: boolean;
	declare public readonly deploy?: { global?: boolean; guilds?: Array<string> | string };
	declare public readonly info?: string;
	declare public readonly usage?: string;
	declare public readonly category?: string;
	declare public readonly cooldown?: number;
	declare public readonly permissions: { client: Permissions | number | bigint | null; user: Permissions | number | bigint | null };
	declare public readonly strict?: { owner?: boolean; users?: Array<string>; channels?: Array<string>; guilds?: Array<string>; types?: ChannelType };
	declare public readonly ignore?: { owner?: boolean; users?: Array<string>; channels?: Array<string>; guilds?: Array<string>; types?: ChannelType };

	// Static
	declare public readonly filetype: 'XernerxMessageCommand';

	/**
	 * Constructs an instance of XernerxMessageCommandBuilder.
	 *
	 * @param id - A unique identifier for the command.
	 * @param options - An object containing configuration options for the command.
	 * @param options.name - The name of the command.
	 * @param options.alias - An alias or an array of aliases for the command.
	 * @param options.prefix - A prefix or an array of prefixes for the command.
	 * @param options.premium - An array indicating premium features or settings.
	 */
	constructor(id: string, options: XernerxMessageCommandBuilderOptions) {
		super(id, options);

		options = z
			.object({
				name: z.string(),
				alias: z.union([z.string(), z.array(z.string())]).default([]),
				prefix: z.union([z.string(), z.array(z.string())]).default([]),
				premium: z.any(),
			})
			.parse(options);

		this.name = options.name;

		this.alias = typeof options.alias == 'string' ? [options.alias] : (options.alias as Array<string>);

		this.prefix = typeof options.prefix == 'string' ? [options.prefix] : (options.prefix as Array<string>);

		this.premium = options.premium;

		this.filetype = 'XernerxMessageCommand';
	}

	/**
	 * Executes the command logic. This function is intended to be overridden by subclasses.
	 * If not overridden, it will log a warning indicating that the command will not respond.
	 *
	 * @param args - A variable number of arguments that can be passed to the command execution.
	 * @returns A promise that resolves to any value, depending on the implementation.
	 */
	public async exec(...args: any[]): Promise<any> {
		new XernerxWarn(`${this.id} has no exec function, command will not respond.`);
	}
}
