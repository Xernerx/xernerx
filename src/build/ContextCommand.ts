import {
	ChannelType,
	ContextMenuCommandBuilder,
	ContextMenuCommandType,
	Interaction,
} from "discord.js";
import { ContextCommandOptions } from "../interfaces/CommandInterfaces.js";
import { s } from "@sapphire/shapeshift";
import { XernerxClient } from "../main.js";

/**
 * @description The command builder for context commands.
 * @param {String} id - The unique ID of the command.
 * @param {ContextCommandOptions} options - The command options.
 */
export class ContextCommand {
	id: string;
	data: ContextMenuCommandBuilder;
	description?: string;
	info?: string;
	category?: string;
	owner?: boolean;
	channelType?: ChannelType;
	cooldown?: number;
	ignoreOwner?: boolean;
	channels?: string[];
	guilds?: string[];
	userPermissions?: bigint[];
	clientPermissions?: bigint[];
	defer?: {
		reply?: boolean;
		ephemeral?: boolean;
		fetchReply?: boolean;
	};
	client: XernerxClient | object;

	constructor(id: string, options: ContextCommandOptions) {
		this.id = id;

		this.data = new ContextMenuCommandBuilder();

		if (options.name) this.data.setName(options.name);

		if (options.type) this.data.setType(options.type);

		if (options.defaultMemberPermissions)
			this.data.setDefaultMemberPermissions(options.defaultMemberPermissions);

		if (options.DMPermission) this.data.setDMPermission(options.DMPermission);

		if (options.nameLocalization)
			this.data.setNameLocalization(
				options.nameLocalization.locale,
				options.nameLocalization.localizedName
			);

		if (options.nameLocalizations)
			this.data.setNameLocalizations(options.nameLocalizations);

		s.object({
			description: s.string.optional,
			info: s.string.optional,
			category: s.string.optional,
			owner: s.boolean.optional,
			// channelType?: ChannelType,
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
		}).parse(options);

		this.description = options.description;

		this.info = options.info;

		this.category = options.category;

		this.owner = options.owner;

		this.channelType = options.channelType;

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

	/**
	 * @param {Interaction} interaction - The Discord interaction event data.
	 * @description make any preconditions here.
	 */
	async conditions(interaction: Interaction) { }

	/**
	 * @param {Interaction} interaction - The Discord interaction event data.
	 * @description Make your custom command here.
	 */
	async exec(interaction: Interaction) { }
}
