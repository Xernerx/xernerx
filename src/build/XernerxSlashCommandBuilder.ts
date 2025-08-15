/** @format */

import { XernerxWarn } from '../tools/XernerxWarn.js';
import { XernerxSlashCommandBuilderOptions } from '../interfaces/XernerxSlashCommandBuilderOptions.js';
import { XernerxBaseBuilder } from './XernerxBaseBuilder.js';
import { z } from 'zod';
import {
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

type XernerxSlashCommandOptions = Array<{ name: string; type: 'string'; description: string; required: boolean }>;

export class XernerxSlashCommandBuilder extends XernerxBaseBuilder {
	declare public readonly filetype: 'XernerxSlashCommand';
	declare public readonly name: string;
	declare public readonly description: string;
	declare public readonly data: SlashCommandBuilder;
	declare public readonly guildId: Array<string>;
	declare public readonly global: boolean;
	declare public readonly options: XernerxSlashCommandOptions;
	declare public readonly subcommands: Array<{ name: string; description: string; options: XernerxSlashCommandOptions }>;
	declare public readonly groups: Array<{ name: string; description: string; subcommands: Array<{ name: string; description: string; options: XernerxSlashCommandOptions }> }>;

	constructor(id: string, options: XernerxSlashCommandBuilderOptions) {
		super(id, options);

		options = z
			.object({
				name: z.string(),
				description: z.string(),
				global: z.boolean().default(true),
				guildId: z.string().or(z.array(z.string())).default([]),
				options: z.any(),
				subcommands: z.any(),
				groups: z.any(),
			})
			.parse(options);

		this.name = options.name;

		this.description = options.description;

		this.global = options.global ?? true;

		this.data = new SlashCommandBuilder();

		this.data.setName(this.name);

		this.data.setDescription(this.description);
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

		this.guildId = typeof options.guildId == 'string' ? [options.guildId] : options.guildId || [];

		this.filetype = 'XernerxSlashCommand';
	}

	public async exec(...args: any[]): Promise<void> {
		new XernerxWarn(`${this.id} has no exec function, command will not respond.`);
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

			if (subcommand.options && subcommand?.options?.length > 0) this.addArguments(sub, subcommand.options);

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

type SlashCommandArgumentType = 'attachment' | 'boolean' | 'channel' | 'integer' | 'mentionable' | 'number' | 'role' | 'string' | 'user';
interface SlashCommandArgumentOptions {
	type: SlashCommandArgumentType;
	name: string;
	description: string;
	required?: boolean;
	autocomplete?: boolean;
	choices?: Array<Record<string, string>>;
}

type UpperCasedSlashCommandArgumentOptions = 'Attachment' | 'Boolean' | 'Channel' | 'Integer' | 'Mentionable' | 'Number' | 'Role' | 'String' | 'User';
type SlashCommandOption = SlashCommandOptionChoices | SlashCommandBooleanOption | SlashCommandUserOption | SlashCommandChannelOption | SlashCommandRoleOption | SlashCommandMentionableOption;
type SlashCommandOptionChoices = SlashCommandStringOption | SlashCommandNumberOption | SlashCommandIntegerOption;
interface SlashCommandSubcommandOptions {
	name: string;
	description: string;
	options?: Array<SlashCommandArgumentOptions>;
}
interface SlashCommandGroupOptions {
	name: string;
	description: string;
	subcommands: Array<SlashCommandSubcommandOptions>;
}
