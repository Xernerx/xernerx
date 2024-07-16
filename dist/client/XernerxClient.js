/** @format */
import { Client, Collection } from 'discord.js';
import { z } from 'zod';
import * as clack from '@clack/prompts';
import CommandHandler from '../handlers/CommandHandler.js';
import EventHandler from '../handlers/EventHandler.js';
import InhibitorHandler from '../handlers/InhibitorHandler.js';
import IntegrationHandler from '../handlers/IntegrationHandler.js';
import XernerxLog from '../tools/XernerxLog.js';
import ClientUtil from '../utils/ClientUtil.js';
import ExtensionHandler from '../handlers/ExtensionHandler.js';
import deploy from '../functions/deploy.js';
import Cooldowns from '../models/Cooldowns.js';
export default class XernerxClient extends Client {
	constructor(discordOptions, xernerxOptions, config) {
		super(discordOptions);
		clack.intro('Xernerx');
		this.settings = z
			.object({
				local: z.string(),
				global: z.boolean().default(false).optional(),
				debug: z.boolean().default(false).optional(),
				ownerId: z.string().or(z.array(z.string())).default([]),
				ceaseless: z.boolean().default(false),
				permissions: z
					.object({
						client: z.array(z.string()).or(z.null()).default(null),
						user: z.array(z.string()).or(z.null()).default(null),
						dm: z.boolean().default(false),
					})
					.optional(),
				ignore: z
					.object({
						owner: z.boolean().default(false),
						self: z.boolean().default(true),
						bots: z.boolean().default(true),
						system: z.boolean().default(true),
						users: z.array(z.string()).default([]),
						channels: z.array(z.string()).default([]),
						guilds: z.array(z.string()).default([]),
					})
					.optional(),
				log: z
					.object({
						ready: z.boolean().default(false),
						info: z.boolean().default(false),
						warn: z.boolean().default(false),
						error: z.boolean().default(false),
						table: z.array(z.string()).or(z.null()).default(null),
						format: z.array(z.string()).or(z.null()).default(null),
					})
					.or(z.boolean())
					.optional(),
				cooldown: z
					.object({
						command: z.number().default(0),
						cache: z.number().default(0),
						collections: z.array(z.string()).default(['commands']),
					})
					.optional(),
			})
			.parse(xernerxOptions);
		this.config = config;
		this.commands = {
			message: new Collection(),
			slash: new Collection(),
			context: new Collection(),
		};
		this.events = new Collection();
		this.inhibitors = new Collection();
		this.util = new ClientUtil(this);
		this.stats = {
			guildCount: this.guilds.cache.size,
			userCount: 0,
			shardId: 0,
			shardCount: this.options.shardCount || 1,
			voteCount: 0,
		};
		this.dbl = {};
		this.cache = {
			messages: new Collection(),
			cooldowns: new Collection(),
		};
		this.cooldowns = new Cooldowns(this, xernerxOptions.cooldown?.collections);
		this.modules = {
			options: {},
			commandHandler: new CommandHandler(this),
			eventHandler: new EventHandler(this),
			inhibitorHandler: new InhibitorHandler(this),
			integrationHandler: new IntegrationHandler(this),
			extensionHandler: new ExtensionHandler(this),
		};
	}
	async connect(token) {
		if (this.settings.debug) new XernerxLog(this).debug(`Connecting to discord using token ${token}...`);
		const login = await this.login(token).catch(() => {
			new XernerxLog(this).error('An invalid token was provided. Please make sure to provide a valid Discord bot token.');
		});
		if (this.settings.debug) new XernerxLog(this).debug(`Connected to discord using token ${token}`);
		deploy(this);
		new XernerxLog(this).ready();
		const spinner = clack.spinner();
		spinner.start();
		return login;
	}
}
