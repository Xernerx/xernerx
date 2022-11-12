import { MessageCommandOptions } from "../interfaces/CommandInterfaces.js";
import { Message, ChannelType } from "discord.js";
import { s } from "@sapphire/shapeshift";
import { XernerxClient } from "../main.js";

/**
 * @description - The command builder for message commands.
 * @param {String} id - The unique ID of the command.
 * @param {MessageCommandOptions} options - The command options.
 */
export class MessageCommand {
	id: string;
	name: string;
	aliases?: string[];
	description?: string;
	info?: string;
	category?: string;
	prefix?: string | string[];
	owner?: boolean;
	channelType?: ChannelType | ChannelType[];
	separator?: string;
	cooldown?: number;
	ignoreOwner?: boolean;
	channels?: string[];
	guilds?: string[];
	userPermissions?: bigint[];
	clientPermissions?: bigint[];
	args: object;
	client: XernerxClient | object;

	constructor(id: string, options: MessageCommandOptions) {
		this.id = id;

		s.object({
			name: s.string,
			aliases: s.union(s.array(s.string).unique, s.string).optional,
			description: s.string.optional,
			info: s.string.optional,
			category: s.string.optional,
			prefix: s.union(s.array(s.string).unique, s.string).optional,
			owner: s.boolean.optional,
			// channelType: s.union(s.enum(ChannelType),s.array(s.enum(ChannelType)).unique).optional,
			separator: s.string.optional,
			cooldown: s.number.optional,
			ignoreOwner: s.boolean.optional,
			channels: s.array(s.string).unique.optional,
			guilds: s.array(s.string).unique.optional,
			userPermissions: s.array(s.bigint).unique.optional,
			clientPermissions: s.array(s.bigint).unique.optional,
		}).parse(options);

		this.name = options.name;

		this.aliases = options.aliases;

		this.description = options.description;

		this.info = options.info;

		this.category = options.category;

		this.prefix = options.prefix
			? Array.isArray(options.prefix)
				? options.prefix
				: [options.prefix]
			: [];

		this.owner = options.owner || false;

		this.channelType = options.channelType;

		this.separator = options.separator || " ";

		this.cooldown = options.cooldown || 0;

		this.ignoreOwner = options.ignoreOwner || false;

		this.channels = options.channels || [];

		this.guilds = options.guilds || [];

		this.userPermissions = options.userPermissions || [];

		this.clientPermissions = options.clientPermissions || [];

		this.args = options.args;

		this.client = {};

		this.conditions = this.conditions;

		this.exec = this.exec;
	}

	/**
	 * @param {Message} message - The Discord message event data.
	 * @param {object} args - The arguments you created.
	 * @description make any preconditions here.
	 */
	async conditions(message: Message, args: object) {}

	/**
	 * @param {Message} message - The Discord message event data.
	 * @param {object} args - The arguments you created.
	 * @description Make your custom command here.
	 */
	async exec(message: Message, args: object) {}
}
