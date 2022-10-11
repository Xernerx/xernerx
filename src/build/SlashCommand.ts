import { SlashCommandOptions } from "../interfaces/CommandInterfaces.js";
import {
	ChannelType,
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
	SlashCommandSubcommandGroupBuilder,
} from "discord.js";
import { s } from "@sapphire/shapeshift";

export class SlashCommand {
	id: string;
	data: SlashCommandBuilder;
	info?: string;
	category?: string;
	owner?: boolean;
	channelType?: ChannelType;
	separator?: string;
	cooldown?: number;
	ignoreOwner?: boolean;
	channels?: string[];
	guilds?: string[];
	userPermissions?: string[];
	clientPermissions?: string[];
	args?: object[];
	subcommands?: object[];
	groups?: object[];

	constructor(id: string, options: SlashCommandOptions) {
		this.id = id;

		this.data = new SlashCommandBuilder()
			.setName(options.name)
			.setDescription(options.description);

		if (options.args && options?.args?.length > 0) {
			this.addArgs(this.data, options.args);
		}

		if (options.subcommands && options?.subcommands?.length > 0) {
			this.addSubcommands(this.data, options.subcommands);
		}

		if (options.groups && options?.groups?.length > 0) {
			this.addSubcommandGroups(options.groups);
		}

		s.object({
			info: s.string.optional,
			category: s.string.optional,
			owner: s.boolean.optional,
			// channelType: s.ChannelType.optional,
			separator: s.string.optional,
			cooldown: s.number.optional,
			ignoreOwner: s.boolean.optional,
			channels: s.array(s.string).optional,
			guilds: s.array(s.string).optional,
			userPermissions: s.array(s.string).optional,
			clientPermissions: s.array(s.string).optional,
		});

		this.info = options.info;

		this.category = options.category;

		this.owner = options.owner;

		this.channelType = options.channelType;

		this.separator = options.separator;

		this.cooldown = options.cooldown;

		this.ignoreOwner = options.ignoreOwner;

		this.channels = options.channels;

		this.guilds = options.guilds;

		this.userPermissions = options.userPermissions;

		this.clientPermissions = options.clientPermissions;
	}

	addArgs(method: any, args: any) {
		const types = [
			"boolean",
			"integer",
			"number",
			"string",
			"user",
			"role",
			"channel",
			"mentionable",
		];

		for (const argument of args) {
			if (!types.includes(argument.type.toLowerCase()))
				throw new Error(
					`Expected one of ${types.join(", ")}, received ${
						argument.type
					} instead.`
				);

			method[
				`add${
					argument.type.slice(0, 1).toUpperCase() +
					argument.type.slice(1).toLowerCase()
				}Option`
			]((option: any) => {
				option
					.setName(argument.name)
					.setDescription(argument.description)
					.setRequired(argument.required || false);
				if (argument.choices) option.setChoices(...argument?.choices);

				return option;
			});
		}
	}

	addSubcommands(method: any, subcommands: any) {
		for (const subcommand of subcommands) {
			let sub = new SlashCommandSubcommandBuilder()
				.setName(subcommand.name)
				.setDescription(subcommand.description);

			if (subcommand.args?.length > 0) this.addArgs(sub, subcommand.args);

			method.addSubcommand(sub);
		}
	}

	addSubcommandGroups(groups: any) {
		for (const group of groups) {
			let subcommandGroup = new SlashCommandSubcommandGroupBuilder()
				.setName(group.name)
				.setDescription(group.description);

			if (group.subcommands?.length > 0) {
				this.addSubcommands(subcommandGroup, group.subcommands);

				if (group.subcommands.args?.length > 0)
					this.addArgs(group.subcommands, group.subcommands.args);
			}

			this.data.addSubcommandGroup(subcommandGroup);
		}
	}
}
