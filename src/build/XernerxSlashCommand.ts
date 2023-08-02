/** @format */

import Discord, { SlashCommandStringOption, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from 'discord.js';
import { z } from 'zod';
import { XernerxClientType, XernerxMessageContextInteraction, XernerxSlashInteraction, XernerxUserContextInteraction } from '../dhkdkhmfg/extenders.js';
import { SlashCommandArgumentOptions, SlashCommandArguments, SlashCommandGroupOptions, SlashCommandOptions, SlashCommandSubcommandOptions } from '../dhkdkhmfg/interfaces.js';
import { SlashCommandArgumentType, SlashCommandOption, XernerxInteraction } from '../dhkdkhmfg/types.js';
import { XernerxLog } from '../main.js';

export default class XernerxSlashCommand {
	public declare readonly id;
	public declare readonly data;
	public declare readonly name;
	public declare readonly description;
	public declare readonly usage;
	public declare readonly info;
	public declare readonly category;
	public declare readonly cooldown;
	public declare readonly ignore;
	public declare readonly strict;
	public declare readonly permissions;
	public declare readonly defer;
	public declare readonly filetype: 'SlashCommand';
	public declare readonly filepath: string;
	public declare readonly client: XernerxClientType;

	public constructor(id: string, options: SlashCommandOptions) {
		this.id = id;

		this.data = new Discord.SlashCommandBuilder();

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
				number: z.number().or(z.null()).default(null),
				channelType: z.array(z.number()).or(z.null()).default(null),
				ignore: z
					.object({
						owner: z.boolean().default(false),
						users: z.array(z.string()).default([]),
						channels: z.array(z.string()).default([]),
						guilds: z.array(z.string()).default([]),
					})
					.default({}),
				strict: z
					.object({
						owner: z.boolean().default(false),
						users: z.array(z.string()).default([]),
						channels: z.array(z.string()).default([]),
						guilds: z.array(z.string()).default([]),
					})
					.default({}),
				permissions: z
					.object({
						user: z.array(z.string()).default([]),
						client: z.array(z.string()).default([]),
						dm: z.boolean().default(true),
					})
					.default({}),
				defer: z
					.object({
						reply: z.boolean().default(false),
						ephemeral: z.boolean().default(false),
						fetch: z.boolean().default(false),
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

		this.ignore = options.ignore;

		this.strict = options.strict;

		this.permissions = options.permissions;

		this.defer = options.defer;

		this.client = this.client;
	}

	/**
	 * @description autocomplete let's you add choices to string option arguments
	 * @param interaction - The interaction event emitted on this command
	 * @param focused - The command option that is in focus
	 * @param options - The full list of options on the command
	 */
	public async autocomplete<T>(
		interaction: XernerxInteraction<XernerxSlashInteraction | XernerxUserContextInteraction | XernerxMessageContextInteraction>,
		focused: T,
		options: T[]
	): Promise<void | any | T> {}

	/**
	 * @description Checks for conditions before running the command
	 * @param interaction - The interaction event emitted on this command
	 * @param options - The args, group and subcommand parsed on this command
	 */
	public async conditions<T>(
		interaction: XernerxInteraction<XernerxSlashInteraction | XernerxUserContextInteraction | XernerxMessageContextInteraction>,
		{ args, subcommand, group }: SlashCommandArguments
	): Promise<void | any | T> {}

	/**
	 * @description Runs the execution rule
	 * @param interaction - The interaction event emitted on this command
	 * @param options - The args, group and subcommand parsed on this command
	 */
	public async exec<T>(
		interaction: XernerxInteraction<XernerxSlashInteraction | XernerxUserContextInteraction | XernerxMessageContextInteraction>,
		{ args, subcommand, group }: SlashCommandArguments
	): Promise<void | any | T> {
		new XernerxLog(this.client).error(`${this.id} doesn't have an execution rule.`);

		return await this.client.emit('commandError', interaction, `${this.id} doesn't have an execution rule.`, this, this.filetype);
	}

	private addArguments(command: Discord.SlashCommandBuilder | SlashCommandSubcommandBuilder, args: Array<SlashCommandArgumentOptions>) {
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

	private addSubcommands(method: Discord.SlashCommandBuilder | SlashCommandSubcommandGroupBuilder, subcommands: Array<SlashCommandSubcommandOptions>) {
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
