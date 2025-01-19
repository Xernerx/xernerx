/** @format */

import { AutocompleteFocusedOption, AutocompleteInteraction, SlashCommandBuilder, SlashCommandStringOption, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from 'discord.js';
import { z } from 'zod';

import { XernerxClientType, XernerxMessageContextInteraction, XernerxSlashInteraction, XernerxUserContextInteraction } from '../types/extenders.js';
import { SlashCommandArgumentOptions, SlashCommandArguments, SlashCommandGroupOptions, SlashCommandOptions, SlashCommandSubcommandOptions } from '../types/interfaces.js';
import { SlashCommandArgumentType, SlashCommandOption, XernerxInteraction } from '../types/types.js';
import XernerxLog from '../tools/XernerxLog.js';
import InteractionUtil from '../utils/InteractionUtil.js';

export default class XernerxSlashCommand {
	public declare readonly id;
	public declare readonly data;
	public declare readonly name;
	public declare readonly description;
	public declare readonly usage;
	public declare readonly info;
	public declare readonly category;
	public declare readonly cooldown;
	public declare readonly channel;
	public declare readonly global;
	public declare readonly ignore;
	public declare readonly strict;
	public declare readonly permissions;
	public declare readonly defer;
	public declare readonly filetype: 'SlashCommand';
	public declare readonly filepath: string;
	public declare readonly client: XernerxClientType;
	public declare snowflake: string | null;
	public declare util: InteractionUtil;

	public constructor(id: string, options: SlashCommandOptions) {
		this.id = id;

		this.data = new SlashCommandBuilder();

		this.data.setName(options.name);

		this.data.setNameLocalizations(options.nameLocalizations || null);

		this.data.setDescription(options.description);

		this.data.setDescriptionLocalizations(options.descriptionLocalizations || null);

		this.data.setDMPermission(options.permissions?.dm || null);

		if (options.args && options?.args?.length > 0) {
			this.addArguments(this.data, options.args);
		}

		if (options.subcommands && options?.subcommands?.length > 0) {
			this.addSubcommands(this.data, options.subcommands);
		}

		if (options.groups && options?.groups?.length > 0) {
			this.addSubcommandGroups(options.groups);
		}

		options = z
			.object({
				name: z.string(),
				description: z.string(),
				usage: z.string().or(z.null()).default(null),
				info: z.string().or(z.null()).default(null),
				category: z.string().or(z.null()).default(null),
				cooldown: z.number().or(z.null()).default(null),
				number: z.number().or(z.null()).default(null),
				global: z.boolean().default(true),
				channel: z
					.array(
						z.enum([
							'GuildText',
							'DM',
							'GuildVoice',
							'GroupDM',
							'GuildCategory',
							'GuildAnnouncement',
							'AnnouncementThread',
							'PublicThread',
							'PrivateThread',
							'GuildStageVoice',
							'GuildDirectory',
							'GuildForum',
							'GuildNews',
							'GuildNewsThread',
							'GuildPublicThread',
							'GuildPrivateThread',
						])
					)
					.or(
						z.enum([
							'GuildText',
							'DM',
							'GuildVoice',
							'GroupDM',
							'GuildCategory',
							'GuildAnnouncement',
							'AnnouncementThread',
							'PublicThread',
							'PrivateThread',
							'GuildStageVoice',
							'GuildDirectory',
							'GuildForum',
							'GuildNews',
							'GuildNewsThread',
							'GuildPublicThread',
							'GuildPrivateThread',
						])
					)
					.or(z.null())
					.default(null),
				ignore: z
					.object({
						owner: z.boolean().default(false),
						users: z.array(z.string()).default([]),
						channels: z.array(z.string()).default([]),
						guilds: z.array(z.string()).default([]),
						voice: z.boolean().default(false),
					})
					.default({}),
				strict: z
					.object({
						owner: z.boolean().default(false),
						users: z.array(z.string()).default([]),
						channels: z.array(z.string()).default([]),
						guilds: z.array(z.string()).default([]),
						voice: z.boolean().default(false),
					})
					.default({}),
				permissions: z
					.object({
						user: z.array(z.string()).or(z.null()).default(null),
						client: z.array(z.string()).or(z.null()).default(null),
						dm: z.boolean().default(true),
					})
					.default({}),
				defer: z
					.object({
						reply: z.boolean().optional(),
						ephemeral: z.boolean().optional(),
						fetch: z.boolean().optional(),
					})
					.default({}),
			})
			.parse(options);

		this.name = options.name;

		this.description = options.description;

		this.usage = options.usage;

		this.info = options.info;

		this.category = options.category;

		this.cooldown = options.cooldown;

		this.channel = options.channel ? (Array.isArray(options.channel) ? options.channel : [options.channel]) : null;

		this.global = options.global;

		this.ignore = options.ignore;

		this.strict = options.strict;

		this.permissions = options.permissions;

		this.defer = options.defer;

		this.client = this.client;

		this.util = this.util;
	}

	/**
	 * @description autocomplete let's you add choices to string option arguments
	 * @param interaction - The interaction event emitted on this command
	 * @param focused - The command option that is in focus
	 * @param options - The full list of options on the command
	 */
	public async autocomplete<T = void>(interaction: AutocompleteInteraction, focused: AutocompleteFocusedOption, options: any[]): Promise<void | any | T> {}

	/**
	 * @description Checks for conditions before running the command
	 * @param interaction - The interaction event emitted on this command
	 * @param options - The args, group and subcommand parsed on this command
	 */
	public async conditions<T = void>(
		interaction: XernerxInteraction<XernerxSlashInteraction | XernerxUserContextInteraction | XernerxMessageContextInteraction>,
		{ args, subcommand, group }: SlashCommandArguments
	): Promise<void | any | T> {}

	/**
	 * @description Runs the execution rule
	 * @param interaction - The interaction event emitted on this command
	 * @param options - The args, group and subcommand parsed on this command
	 */
	public async exec<T = void>(
		interaction: XernerxInteraction<XernerxSlashInteraction | XernerxUserContextInteraction | XernerxMessageContextInteraction>,
		{ args, subcommand, group }: SlashCommandArguments
	): Promise<void | any | T> {
		new XernerxLog(this.client).error(`${this.id} doesn't have an execution rule.`);

		return await this.client.emit('commandError', interaction, `${this.id} doesn't have an execution rule.`, this);
	}

	private addArguments(command: SlashCommandBuilder | SlashCommandSubcommandBuilder, args: Array<SlashCommandArgumentOptions>) {
		for (const argument of args) {
			let slashCommandArgumentType: SlashCommandArgumentType | string = `${argument.type.charAt(0).toUpperCase()}${argument.type.slice(1).toLowerCase()}`;

			(command[`add${slashCommandArgumentType as UpperCasedSlashCommandArgumentOptions}Option`] as Function)((option: SlashCommandOption) => {
				option
					.setName(argument.name)
					.setDescription(argument.description)
					.setRequired(argument.required || false);

				if (slashCommandArgumentType === 'String') {
					if (argument.choices)
						(option as SlashCommandStringOption).setChoices(
							...(argument.choices.map((choices) => {
								return { name: Object.keys(choices).at(0), value: Object.values(choices).at(0) };
							}) as Array<any>)
						);

					(option as SlashCommandStringOption).setAutocomplete(argument.autocomplete || false);
				}

				return option;
			});
		}
	}

	private addSubcommands(method: SlashCommandBuilder | SlashCommandSubcommandGroupBuilder, subcommands: Array<SlashCommandSubcommandOptions>) {
		for (const subcommand of subcommands) {
			let sub = new SlashCommandSubcommandBuilder().setName(subcommand.name).setDescription(subcommand.description);

			if (subcommand.args && subcommand?.args?.length > 0) this.addArguments(sub, subcommand.args);

			method.addSubcommand(sub);
		}
	}

	private addSubcommandGroups(groups: Array<SlashCommandGroupOptions>) {
		for (const group of groups) {
			let subcommandGroup = new SlashCommandSubcommandGroupBuilder().setName(group.name).setDescription(group.description);

			if (group.subcommands?.length > 0) this.addSubcommands(subcommandGroup, group.subcommands);

			this.data.addSubcommandGroup(subcommandGroup);
		}
	}
}

type UpperCasedSlashCommandArgumentOptions = 'Attachment' | 'Boolean' | 'Channel' | 'Integer' | 'Mentionable' | 'Number' | 'Role' | 'String' | 'User';
