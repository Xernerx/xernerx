import Discord, {
	ChannelType,
	Interaction,
	SlashCommandStringOption,
	SlashCommandSubcommandBuilder,
	SlashCommandSubcommandGroupBuilder,
} from "discord.js";
import { s } from "@sapphire/shapeshift";
import { SlashCommandOption, SlashArgumentTypes } from "../types/enums.js";
import { XernerxClient } from "../main.js";
import XernerxError from "../tools/XernerxError.js";
import { SlashArgOptions, SlashCommandOptions, SlashGroupOptions, SlashSubcommandOptions } from "../types/options.js";

/**
 * @description - The command builder for slash commands.
 * @param {String} id - The unique ID of the command.
 * @param {SlashCommandOptions} options - The command options.
 */
export default class SlashCommandBuilder {
	id: string;
	data: Discord.SlashCommandBuilder;
	info?: string;
	category?: string;
	owner?: boolean;
	channelType?: ChannelType;
	separator?: string;
	cooldown?: number;
	ignoreOwner?: boolean;
	channels?: string[];
	guilds?: string[];
	userPermissions?: bigint[];
	clientPermissions?: bigint[];
	args?: object[];
	subcommands?: object[];
	groups?: object[];
	defer?: {
		reply?: boolean;
		ephemeral?: boolean;
		fetchReply?: boolean;
	};
	client: XernerxClient | object;

	constructor(id: string, options: SlashCommandOptions) {
		this.id = id;

		this.data = new Discord.SlashCommandBuilder()
			.setName(options.name)
			.setDescription(options.description);

		if (options.args && options?.args?.length > 0) {
			this.#addArgs(this.data, options.args);
		}

		if (options.subcommands && options?.subcommands?.length > 0) {
			this.#addSubcommands(this.data, options.subcommands);
		}

		if (options.groups && options?.groups?.length > 0) {
			this.#addSubcommandGroups(options.groups);
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
			userPermissions: s.array(s.bigint).optional,
			clientPermissions: s.array(s.bigint).optional,
			defer: s.object({
				reply: s.boolean.optional,
				ephemeral: s.boolean.optional,
				fetchReply: s.boolean.optional,
			}).optional,
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

		this.defer = options.defer;

		this.client = XernerxClient;

		this.conditions = this.conditions;

		this.exec = this.exec;
	}

	async conditions(interaction: Interaction) { }

	async exec(interaction: Interaction) { }

	#addArgs(
		command: Discord.SlashCommandBuilder | SlashCommandSubcommandBuilder,
		args: Array<SlashArgOptions>
	) {
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
			if (!types.includes(argument.type.toLowerCase())) throw new XernerxError(`Expected one of ${types.join(", ")}, received ${argument.type} instead.`);

			let slashArgumentType: SlashArgumentTypes | string = `${argument.type.slice(0, 1).toUpperCase()}${argument.type.slice(1).toLowerCase()}`;

			(command[(`add${slashArgumentType as SlashArgumentTypes}Option`)] as Function)(
				(option: SlashCommandOption) => {
					option
						.setName(argument.name)
						.setDescription(argument.description)
						.setRequired(argument.required || false);
					if (argument.choices)
						(option as SlashCommandStringOption).setChoices(
							...argument?.choices
						);

					return option;
				}
			);
		}
	}

	#addSubcommands(
		method: Discord.SlashCommandBuilder | SlashCommandSubcommandGroupBuilder,
		subcommands: Array<SlashSubcommandOptions>
	) {
		for (const subcommand of subcommands) {
			let sub = new SlashCommandSubcommandBuilder()
				.setName(subcommand.name)
				.setDescription(subcommand.description);

			if (subcommand.args?.length > 0) this.#addArgs(sub, subcommand.args);

			method.addSubcommand(sub);
		}
	}

	#addSubcommandGroups(groups: Array<SlashGroupOptions>) {
		for (const group of groups) {
			let subcommandGroup = new SlashCommandSubcommandGroupBuilder()
				.setName(group.name)
				.setDescription(group.description);

			if (group.subcommands?.length > 0)
				this.#addSubcommands(subcommandGroup, group.subcommands);

			this.data.addSubcommandGroup(subcommandGroup);
		}
	}
}
