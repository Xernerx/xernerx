import {
	ChannelType,
	ContextMenuCommandBuilder,
	ContextMenuCommandType,
	Message,
} from "discord.js";
import { ContextCommandOptions } from "../interfaces/CommandInterfaces.js";
import { s } from "@sapphire/shapeshift";

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
	separator?: string;
	cooldown?: number;
	ignoreOwner?: boolean;
	channels?: string[];
	guilds?: string[];
	userPermissions?: string[];
	clientPermissions?: string[];
	defer?: {
		reply?: boolean;
		ephemeral?: boolean;
		fetchReply?: boolean;
	};

	constructor(id: string, options: ContextCommandOptions) {
		this.id = id;

		this.data = new ContextMenuCommandBuilder();

		if (options.name) this.data.setName(options.name);

		if (options.type) this.data.setType(this.#types(options.type));

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
			separator: s.string.optional,
			cooldown: s.number.optional,
			ignoreOwner: s.boolean.optional,
			channels: s.array(s.string).optional,
			guilds: s.array(s.string).optional,
			userPermissions: s.array(s.string).optional,
			clientPermissions: s.array(s.string).optional,
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

		this.separator = options.separator;

		this.cooldown = options.cooldown;

		this.ignoreOwner = options.ignoreOwner;

		this.channels = options.channels;

		this.guilds = options.guilds;

		this.userPermissions = options.userPermissions;

		this.clientPermissions = options.clientPermissions;

		this.defer = options.defer;
	}

	/**
	 * @param {Message} message - The Discord message event data.
	 * @param {object} args - The arguments you created.
	 * @description make any preconditions here.
	 */
	conditions(message: Message, args: object) {}

	/**
	 * @param {Message} message - The Discord message event data.
	 * @param {object} args - The arguments you created.
	 * @description Make your custom command here.
	 */
	exec(message: Message, args: object) {}

	#types(type: ContextMenuCommandType) {
		if (String(type)?.toLowerCase() === "message") type = 3;
		if (String(type)?.toLowerCase() === "user") type = 2;

		return type;
	}
}
