/** @format */

import { ContextMenuCommandBuilder } from 'discord.js';
import { z } from 'zod';

import { XernerxMessageContextInteraction, XernerxUserContextInteraction, XernerxClientType } from '../types/extenders.js';
import { ContextCommandArguments, ContextCommandOptions } from '../types/interfaces.js';
import { XernerxLog } from '../main.js';

export default class XernerxContextCommand {
	public declare readonly id;
	public declare readonly data;
	public declare readonly name;
	public declare readonly type: 'user' | 'message';
	public declare readonly description;
	public declare readonly usage;
	public declare readonly info;
	public declare readonly category;
	public declare readonly cooldown;
	public declare readonly channel;
	public declare readonly global;
	public declare readonly ignore;
	public declare readonly strict;
	public declare readonly permissions;
	public declare readonly defer;
	public declare readonly filetype: 'ContextCommand';
	public declare readonly filepath: string;
	public declare readonly client: XernerxClientType;

	public constructor(id: string, options: ContextCommandOptions) {
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
						user: z.array(z.string()).default([]),
						client: z.array(z.string()).default([]),
						dm: z.boolean().default(true),
					})
					.default({}),
				defer: z
					.object({
						reply: z.boolean().default(false),
						ephemeral: z.boolean().default(false),
						fetch: z.boolean().default(false),
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
	}

	/**
	 * @description the execution of the command
	 * @param interaction - Interaction event emitted on command
	 * @param args - The arguments parsed with the command, if any
	 */
	public async exec(interaction: XernerxUserContextInteraction | XernerxMessageContextInteraction, args: ContextCommandArguments<'user' | 'message'>): Promise<any> {
		new XernerxLog(this.client).error(`${this.id} doesn't have an execution rule.`);

		return await this.client.emit('commandError', interaction, `${this.id} doesn't have an execution rule.`, this, this.filetype);
	}
}
