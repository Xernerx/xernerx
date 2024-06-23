/** @format */
import { z } from 'zod';
import XernerxLog from '../tools/XernerxLog.js';
export default class XernerxMessageCommand {
	constructor(id, options) {
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
	async conditions(message, { args, flags }) {}
	/**
	 * @description Runs the execution rule
	 * @param message - The message event emitted on this command
	 * @param options - The args and flags parsed on this command
	 */
	async exec(message, { args, flags }) {
		new XernerxLog(this.client).error(`${this.id} doesn't have an execution rule.`);
		return await this.client.emit('commandError', message, `${this.id} doesn't have an execution rule.`, this);
	}
}
