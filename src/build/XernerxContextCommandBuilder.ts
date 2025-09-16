/** @format */

import {
	ApplicationIntegrationType,
	ChannelType,
	ContextMenuCommandBuilder,
	ContextMenuCommandType,
	InteractionContextType,
	Locale,
	PermissionFlags,
	PermissionFlagsBits,
	Permissions,
	RestOrArray,
} from 'discord.js';

import { XernerxBaseBuilder } from './XernerxBaseBuilder.js';
import { XernerxContextCommandBuilderOptions } from '../interfaces/XernerxContextCommandBuilderOptions.js';
import { XernerxContextCommandOptions } from '../interfaces/XernerxContextCommandOptions.js';
import { XernerxWarn } from '../tools/XernerxWarn.js';
import { z } from 'zod';

export class XernerxContextCommandBuilder extends XernerxBaseBuilder {
	// Discord
	declare public readonly name: string;
	declare public readonly description: string;
	declare public readonly integration: RestOrArray<InteractionContextType>;
	declare public readonly data: ContextMenuCommandBuilder;
	declare public readonly type: ContextMenuCommandType;

	// Xernerx
	declare public readonly premium?: boolean;
	declare public readonly defer?: boolean;
	declare public readonly deploy?: { global?: boolean; guilds?: Array<string> | string };
	declare public readonly info?: string;
	declare public readonly usage?: string;
	declare public readonly category?: string;
	declare public readonly cooldown?: number;
	declare public readonly permissions: { client: Permissions | number | bigint | null; user: Permissions | number | bigint | null };
	declare public readonly strict?: { owner?: boolean; users?: Array<string>; channels?: Array<string>; guilds?: Array<string>; types?: ChannelType };
	declare public readonly ignore?: { owner?: boolean; users?: Array<string>; channels?: Array<string>; guilds?: Array<string>; types?: ChannelType };

	// Static
	declare public readonly filetype: 'XernerxContextCommand';

	constructor(id: string, options: XernerxContextCommandBuilderOptions) {
		super(id, options);

		options = z
			.object({
				// Discord
				name: z.string(),
				locales: z.record(z.string(), z.object({ name: z.string() })).optional(),
				description: z.string(),
				contexts: z.array(z.custom<keyof typeof InteractionContextType>()).default(['Guild']),
				integration: z.array(z.custom<keyof typeof ApplicationIntegrationType>()).default(['GuildInstall']),
				type: z.custom<ContextMenuCommandType>(),

				// Xernerx
				premium: z.boolean().default(false),
				defer: z.boolean().default(false),
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

		this.description = options.description;

		this.info = options.info;

		this.usage = options.usage;

		this.category = options.category;

		this.cooldown = options.cooldown;

		this.premium = options.premium || false;

		this.defer = options.defer;

		this.deploy = {
			global: options.deploy?.global ?? true,
			guilds: typeof options.deploy?.guilds == 'string' ? [options.deploy.guilds] : options.deploy?.guilds || [],
		};

		this.filetype = 'XernerxContextCommand';

		this.permissions = options.permissions as typeof this.permissions;

		this.strict = options.strict;

		this.ignore = options.ignore;

		this.data = new ContextMenuCommandBuilder();

		this.data.setName(this.name);

		this.data.setType(options.type);

		this.data.setContexts(...(options.contexts?.map((context) => InteractionContextType[context as keyof typeof InteractionContextType]) || [InteractionContextType.Guild]));

		this.data.setIntegrationTypes(
			...(options.integration?.map((integration) => ApplicationIntegrationType[integration as keyof typeof ApplicationIntegrationType]) || [ApplicationIntegrationType.GuildInstall])
		);

		if (Array.isArray(options.permissions?.user))
			this.data.setDefaultMemberPermissions(options.permissions?.user?.map((permission) => PermissionFlagsBits[permission as keyof PermissionFlags]).reduce((a, b) => (a += b)));
		else this.data.setDefaultMemberPermissions(options.permissions?.user || null);

		for (const locale of Object.entries(options.locales || [])) {
			this.data.setNameLocalization(locale[0] as Locale, locale[1].name);
		}

		this.client = this.client;
	}
	/**
	 * Evaluates conditions for executing a slash command.
	 *
	 * @param args - The arguments for the conditions function, which include the context and options for the command.
	 * @returns A promise that resolves to either void or any value, depending on the implementation.
	 */
	public async conditions(args: XernerxContextCommandOptions<'message' | 'user'>): Promise<void | any> {}

	/**
	 * Executes the slash command.
	 *
	 * @param args - The arguments for the exec function, which include the context and options for the command.
	 * @returns A promise that resolves to either void or any value, depending on the implementation.
	 */
	public async exec(args: XernerxContextCommandOptions<'message' | 'user'>): Promise<void | any> {
		new XernerxWarn(`${this.id} has no exec function, command will not respond.`);
	}
}
