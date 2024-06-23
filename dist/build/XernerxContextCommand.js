/** @format */
import { ContextMenuCommandBuilder } from 'discord.js';
import { z } from 'zod';
import XernerxLog from '../tools/XernerxLog.js';
export default class XernerxContextCommand {
	constructor(id, options) {
		this.id = id;
		this.data = new ContextMenuCommandBuilder();
		this.data.setName(options.name);
		this.data.setNameLocalizations(options.nameLocalizations || null);
		this.data.setType(options.type === 'user' ? 2 : 3);
		this.data.setDMPermission(options.permissions?.dm || null);
		options = z
			.object({
				name: z.string(),
				type: z.enum(['user', 'message']),
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
				defer: z
					.object({
						reply: z.boolean().optional(),
						ephemeral: z.boolean().optional(),
						fetch: z.boolean().optional(),
					})
					.default({}),
			})
			.parse(options);
		this.name = options.name;
		this.type = options.type;
		this.description = options.description;
		this.usage = options.usage;
		this.info = options.info;
		this.category = options.category;
		this.cooldown = options.cooldown;
		this.channel = options.channel ? (Array.isArray(options.channel) ? options.channel : [options.channel]) : null;
		this.global = options.global;
		this.ignore = options.ignore;
		this.strict = options.strict;
		this.permissions = options.permissions;
		this.defer = options.defer;
		this.client = this.client;
		this.util = this.util;
	}
	/**
	 * @description the execution of the command
	 * @param interaction - Interaction event emitted on command
	 * @param args - The arguments parsed with the command, if any
	 */
	async exec(interaction, args) {
		new XernerxLog(this.client).error(`${this.id} doesn't have an execution rule.`);
		return await this.client.emit('commandError', interaction, `${this.id} doesn't have an execution rule.`, this, this.filetype);
	}
}
