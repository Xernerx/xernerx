/** @format */

import { z } from 'zod';
import {
	ApplicationIntegrationType,
	ChannelType,
	InteractionContextType,
	Locale,
	PermissionFlags,
	PermissionFlagsBits,
	Permissions,
	RestOrArray,
	SlashCommandBooleanOption,
	SlashCommandBuilder,
	SlashCommandChannelOption,
	SlashCommandIntegerOption,
	SlashCommandMentionableOption,
	SlashCommandNumberOption,
	SlashCommandRoleOption,
	SlashCommandStringOption,
	SlashCommandSubcommandBuilder,
	SlashCommandSubcommandGroupBuilder,
	SlashCommandUserOption,
} from 'discord.js';

import { XernerxWarn } from '../tools/XernerxWarn.js';
import {
	XernerxSlashCommandBuilderGroup,
	XernerxSlashCommandBuilderOption,
	XernerxSlashCommandBuilderOptions,
	XernerxSlashCommandBuilderSubcommand,
} from '../interfaces/XernerxSlashCommandBuilderOptions.js';
import { XernerxBaseBuilder } from './XernerxBaseBuilder.js';
import { XernerxSlashCommandOptions, XernerxSlashCommandAutocomplete } from '../interfaces/XernerxSlashCommandOptions.js';

export class XernerxSlashCommandBuilder extends XernerxBaseBuilder {
	// Discord
	declare public readonly name: string;
	declare public readonly description: string;
	declare public readonly integration: RestOrArray<InteractionContextType>;
	declare public readonly data: SlashCommandBuilder;
	declare public readonly options: Array<XernerxSlashCommandBuilderOption>;
	declare public readonly subcommands: Array<XernerxSlashCommandBuilderSubcommand>;
	declare public readonly groups: Array<XernerxSlashCommandBuilderGroup>;

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
	declare public readonly filetype: 'XernerxSlashCommand';

	constructor(id: string, options: XernerxSlashCommandBuilderOptions) {
		super(id, options);

		options = z
			.object({
				// Discord
				name: z.string(),
				locales: z.record(z.string(), z.object({ name: z.string(), description: z.string() })).optional(),
				description: z.string(),
				contexts: z.array(z.custom<keyof typeof InteractionContextType>()).default(['Guild']),
				integration: z.array(z.custom<keyof typeof ApplicationIntegrationType>()).default(['GuildInstall']),
				nsfw: z.boolean().default(false),
				options: z.any(),
				subcommands: z.any(),
				groups: z.any(),

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

		this.filetype = 'XernerxSlashCommand';

		this.permissions = options.permissions as typeof this.permissions;

		this.strict = options.strict;

		this.ignore = options.ignore;

		this.data = new SlashCommandBuilder();

		this.data.setName(this.name);

		this.data.setDescription(this.description);

		this.data.setContexts(...(options.contexts?.map((context) => InteractionContextType[context as keyof typeof InteractionContextType]) || [InteractionContextType.Guild]));

		this.data.setIntegrationTypes(
			...(options.integration?.map((integration) => ApplicationIntegrationType[integration as keyof typeof ApplicationIntegrationType]) || [ApplicationIntegrationType.GuildInstall])
		);

		if (Array.isArray(options.permissions?.user))
			this.data.setDefaultMemberPermissions(options.permissions?.user?.map((permission) => PermissionFlagsBits[permission as keyof PermissionFlags]).reduce((a, b) => (a += b)));
		else this.data.setDefaultMemberPermissions(options.permissions?.user || null);

		this.data.setNSFW(options.nsfw || false);

		for (const locale of Object.entries(options.locales || [])) {
			this.data.setNameLocalization(locale[0] as Locale, locale[1].name);
			this.data.setDescriptionLocalization(locale[0] as Locale, locale[1].description);
		}

		if (options.options && options?.options?.length > 0) {
			this.addArguments(this.data, options.options);

			this.options = options.options;
		}

		if (options.subcommands && options?.subcommands?.length > 0) {
			this.addSubcommands(this.data, options.subcommands);

			this.subcommands = options.subcommands;
		}

		if (options.groups && options?.groups?.length > 0) {
			this.addSubcommandGroups(options.groups);

			this.groups = options.groups;
		}

		this.client = this.client;
	}

	/**
	 * Handles the autocomplete functionality for a slash command.
	 *
	 * @param args - The arguments for the autocomplete function, which include the context and options for the command.
	 * @returns A promise that resolves to either void or any value, depending on the implementation.
	 */
	public async autocomplete(args: XernerxSlashCommandAutocomplete): Promise<void | any> {}

	/**
	 * Evaluates conditions for executing a slash command.
	 *
	 * @param args - The arguments for the conditions function, which include the context and options for the command.
	 * @returns A promise that resolves to either void or any value, depending on the implementation.
	 */
	public async conditions(args: XernerxSlashCommandOptions): Promise<void | any> {}

	/**
	 * Executes the slash command.
	 *
	 * @param args - The arguments for the exec function, which include the context and options for the command.
	 * @returns A promise that resolves to either void or any value, depending on the implementation.
	 */
	public async exec(args: XernerxSlashCommandOptions): Promise<void | any> {
		new XernerxWarn(`${this.id} has no exec function, command will not respond.`);
	}

	private addArguments(command: SlashCommandBuilder | SlashCommandSubcommandBuilder, args: Array<XernerxSlashCommandBuilderOption>) {
		for (const argument of args) {
			let slashCommandArgumentType: string = `${argument.type.charAt(0).toUpperCase()}${argument.type.slice(1).toLowerCase()}`;

			(command[`add${slashCommandArgumentType as UpperCasedSlashCommandArgumentOptions}Option`] as Function)((option: SlashCommandOption) => {
				option
					.setName(argument.name)
					.setDescription(argument.description)
					.setRequired(argument.required || false);

				for (const locale of Object.entries(argument.locales || [])) {
					option.setNameLocalization(locale[0] as Locale, locale[1].name);
					option.setDescriptionLocalization(locale[0] as Locale, locale[1].description);
				}

				if (slashCommandArgumentType === 'String') {
					if (argument.choices) {
						for (const choice of argument.choices) {
							const locales = choice?.locales;

							(option as SlashCommandStringOption).addChoices({ ...choice, name_localizations: locales });
						}
					}

					if (argument.maxLength) (option as SlashCommandStringOption).setMaxLength(argument.maxLength);
					if (argument.minLength) (option as SlashCommandStringOption).setMinLength(argument.minLength);

					(option as SlashCommandStringOption).setAutocomplete(argument.autocomplete || false);
				}

				return option;
			});
		}
	}

	private addSubcommands(method: SlashCommandBuilder | SlashCommandSubcommandGroupBuilder, subcommands: Array<XernerxSlashCommandBuilderSubcommand>) {
		for (const subcommand of subcommands) {
			let sub = new SlashCommandSubcommandBuilder().setName(subcommand.name).setDescription(subcommand.description);

			for (const locale of Object.entries(subcommand.locales || [])) {
				sub.setNameLocalization(locale[0] as Locale, locale[1].name);
				sub.setDescriptionLocalization(locale[0] as Locale, locale[1].description);
			}

			if (subcommand.options && subcommand?.options?.length > 0) this.addArguments(sub, subcommand.options);

			method.addSubcommand(sub);
		}
	}

	/**
	 * Adds subcommand groups to the slash command builder.
	 *
	 * @param groups - An array of subcommand groups to be added. Each group contains a name, description, locales, and subcommands.
	 */
	private addSubcommandGroups(groups: Array<XernerxSlashCommandBuilderGroup>) {
		for (const group of groups) {
			let subcommandGroup = new SlashCommandSubcommandGroupBuilder().setName(group.name).setDescription(group.description);

			for (const locale of Object.entries(group.locales || [])) {
				subcommandGroup.setNameLocalization(locale[0] as Locale, locale[1].name);
				subcommandGroup.setDescriptionLocalization(locale[0] as Locale, locale[1].description);
			}

			if (group.subcommands?.length > 0) this.addSubcommands(subcommandGroup, group.subcommands);

			this.data.addSubcommandGroup(subcommandGroup);
		}
	}
}

type UpperCasedSlashCommandArgumentOptions = 'Attachment' | 'Boolean' | 'Channel' | 'Integer' | 'Mentionable' | 'Number' | 'Role' | 'String' | 'User';
type SlashCommandOption = SlashCommandOptionChoices | SlashCommandBooleanOption | SlashCommandUserOption | SlashCommandChannelOption | SlashCommandRoleOption | SlashCommandMentionableOption;
type SlashCommandOptionChoices = SlashCommandStringOption | SlashCommandNumberOption | SlashCommandIntegerOption;
