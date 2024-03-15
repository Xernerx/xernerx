/** @format */

import { z } from 'zod';

import { XernerxClientType, XernerxMessage } from '../types/extenders.js';
import { MessageCommandArguments, MessageCommandOptions } from '../types/interfaces.js';
import XernerxLog from '../tools/XernerxLog.js';
import MessageUtil from '../utils/MessageUtil.js';

export default class XernerxMessageCommand {
	public declare readonly id;
	public declare readonly name;
	public declare readonly aliases;
	public declare readonly regex;
	public declare readonly prefix;
	public declare readonly description;
	public declare readonly usage;
	public declare readonly info;
	public declare readonly separator;
	public declare readonly args;
	public declare readonly flags;
	public declare readonly category;
	public declare readonly cooldown;
	public declare readonly channel;
	public declare readonly global;
	public declare readonly ignore;
	public declare readonly strict;
	public declare readonly permissions;
	public declare readonly filetype: 'MessageCommand';
	public declare readonly filepath: string;
	public declare readonly client: XernerxClientType;
	public declare snowflake: string | null;
	public declare util: MessageUtil;

	public constructor(id: string, options: MessageCommandOptions) {
		this.id = id;

		this.regex = options.regex;

		this.args = options.args;

		this.flags = options.flags;

		options = z
			.object({
				name: z.string(),
				aliases: z.array(z.string()).default([]),
				description: z.string().or(z.null()).default(null),
				usage: z.string().or(z.null()).default(null),
				info: z.string().or(z.null()).default(null),
				category: z.string().or(z.null()).default(null),
				cooldown: z.number().or(z.null()).default(null),
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
				prefix: z.array(z.string()).or(z.string()).default([]),
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
			})
			.parse(options);

		this.name = options.name;

		this.aliases = options.aliases;

		this.prefix = options.prefix;

		this.description = options.description;

		this.usage = options.usage;

		this.info = options.info;

		this.category = options.category;

		this.cooldown = options.cooldown;

		this.channel = options.channel ? (Array.isArray(options.channel) ? options.channel : [options.channel]) : null;

		this.global = options.global;

		this.ignore = options.ignore;

		this.strict = options.strict;

		this.separator = options.separator;

		this.permissions = options.permissions;

		this.client = this.client;

		this.util = this.util;
	}

	/**
	 * @description Checks for conditions before running the command
	 * @param message - The message event emitted on this command
	 * @param options - The args and flags parsed on this command
	 */
	public async conditions(message: XernerxMessage, { args, flags }: MessageCommandArguments): Promise<any> {}

	/**
	 * @description Runs the execution rule
	 * @param message - The message event emitted on this command
	 * @param options - The args and flags parsed on this command
	 */
	public async exec(message: XernerxMessage, { args, flags }: MessageCommandArguments): Promise<any> {
		new XernerxLog(this.client).error(`${this.id} doesn't have an execution rule.`);

		return await this.client.emit('commandError', message, `${this.id} doesn't have an execution rule.`, this);
	}
}
