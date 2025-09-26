/** @format */

import { ApplicationIntegrationType, ChannelType, PermissionFlags, Permissions } from 'discord.js';

import { BaseBuilder } from './BaseBuilder.js';
import { MessageCommandBuilderOptions } from '../interfaces/MessageCommandBuilderOptions.js';
import { XernerxWarn } from '../tools/XernerxWarn.js';
import { z } from 'zod';

export class MessageCommandBuilder extends BaseBuilder {
	// Discord
	declare public readonly name: string;
	declare public readonly description?: string;
	declare public readonly alias: Array<string>;
	declare public readonly prefix: Array<string>;
	declare public readonly separator: string;
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
	constructor(id: string, options: MessageCommandBuilderOptions) {
		super(id, options);

		options = z
			.object({
				name: z.string(),
				description: z.string().optional(),
				alias: z.union([z.string(), z.array(z.string())]).default([]),
				prefix: z.union([z.string(), z.array(z.string())]).default([]),
				separator: z.string().default(' '),
				locales: z.record(z.string(), z.object({ name: z.string(), description: z.string() })).optional(),
				integration: z.array(z.custom<keyof typeof ApplicationIntegrationType>()).default(['GuildInstall']),
				nsfw: z.boolean().default(false),
				options: z.any(),
				premium: z.boolean().default(false),
				deploy: z.object({ global: z.boolean().default(true), guilds: z.string().or(z.array(z.string())).default([]) }).optional(),
				info: z.string().optional(),
				usage: z.string().optional(),
				category: z.string().optional(),
				cooldown: z.number().min(0).default(0),
				strict: z
					.object({
						owner: z.boolean().default(false),
						users: z.array(z.string()).default([]),
						channels: z.array(z.string()).default([]),
						guilds: z.array(z.string()).default([]),
						types: z.enum(ChannelType).optional(),
					})
					.optional(),
				ignore: z
					.object({
						owner: z.boolean().default(false),
						users: z.array(z.string()).default([]),
						channels: z.array(z.string()).default([]),
						guilds: z.array(z.string()).default([]),
						types: z.enum(ChannelType).optional(),
					})
					.optional(),
				permissions: z
					.object({
						client: z
							.union([z.array(z.custom<keyof PermissionFlags>()), z.number(), z.bigint()])
							.nullable()
							.default(null),
						user: z
							.union([z.array(z.custom<keyof PermissionFlags>()), z.number(), z.bigint()])
							.nullable()
							.default(null),
					})
					.default({ client: null, user: null }),
			})
			.parse(options);

		this.name = options.name;

		this.alias = typeof options.alias == 'string' ? [options.alias] : (options.alias as Array<string>);

		this.prefix = typeof options.prefix == 'string' ? [options.prefix] : (options.prefix as Array<string>);

		this.separator = options.separator || ' ';

		this.description = options.description;

		this.info = options.info;

		this.usage = options.usage;

		this.category = options.category;

		this.cooldown = options.cooldown;

		this.premium = options.premium || false;

		this.deploy = {
			global: options.deploy?.global ?? true,
			guilds: typeof options.deploy?.guilds == 'string' ? [options.deploy.guilds] : options.deploy?.guilds || [],
		};

		this.permissions = options.permissions as typeof this.permissions;

		this.strict = options.strict;

		this.ignore = options.ignore;

		this.filetype = 'XernerxMessageCommand';
	}

	public async conditions(args: any): Promise<void | any> {}

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
