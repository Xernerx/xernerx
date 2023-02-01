import { Message, ChannelType } from 'discord.js';
import { s } from '@sapphire/shapeshift';

import { MessageArgOptions, MessageCommandOptions } from '../types/options.js';
import XernerxClient from '../client/XernerxClient.js';

/**
 * @description - The command builder for message commands.
 * @param {String} id - The unique ID of the command.
 * @param {MessageCommandOptions} options - The command options.
 */
export default class MessageCommandBuilder {
	id: string;
	name: string;
	aliases?: string[];
	description?: string;
	info?: string;
	category?: string;
	prefix?: string | string[];
	regex?: string;
	owner?: boolean;
	channelType?: ChannelType | ChannelType[];
	separator?: string;
	cooldown?: number;
	ignoreOwner?: boolean;
	channels?: string[];
	guilds?: string[];
	userPermissions?: bigint[];
	clientPermissions?: bigint[];
	args?: Array<MessageArgOptions>;
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
			channelType: s.union(s.number, s.array(s.number)).optional,
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

		this.prefix = options.prefix ? (Array.isArray(options.prefix) ? options.prefix : [options.prefix]) : [];

		this.regex = options.regex;

		this.owner = options.owner || false;

		this.channelType = options.channelType;

		this.separator = options.separator || ' ';

		this.cooldown = options.cooldown || 0;

		this.ignoreOwner = options.ignoreOwner || false;

		this.channels = options.channels || [];

		this.guilds = options.guilds || [];

		this.userPermissions = options.userPermissions || [];

		this.clientPermissions = options.clientPermissions || [];

		this.args = options.args || [];

		this.client = XernerxClient;

		this.conditions = this.conditions;

		this.exec = this.exec;
	}

	/**
	 * @param {Message} message - The Discord message event data.
	 * @param {object} args - The arguments you created.
	 * @description make any preconditions here.
	 */
	async conditions(message: Message, args: MessageArgOptions) {}

	/**
	 * @param {Message} message - The Discord message event data.
	 * @param {object} args - The arguments you created.
	 * @description Make your custom command here.
	 */
	async exec(message: Message, args: MessageArgOptions) {}
}
