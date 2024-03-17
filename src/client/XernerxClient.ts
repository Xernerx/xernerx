/** @format */

import { Client, ClientOptions, Collection } from 'discord.js';
import { z } from 'zod';

import CommandHandler from '../handlers/CommandHandler.js';
import EventHandler from '../handlers/EventHandler.js';
import InhibitorHandler from '../handlers/InhibitorHandler.js';
import IntegrationHandler from '../handlers/IntegrationHandler.js';
import XernerxLog from '../tools/XernerxLog.js';
import { XernerxOptions, ModuleOptions, XernerxCommands, XernerxCache } from '../types/interfaces.js';
import { XernerxClientEvents } from '../types/extenders.js';
import ClientUtil from '../utils/ClientUtil.js';
import XernerxInhibitor from '../build/XernerxInhibitor.js';
import XernerxEvent from '../build/XernerxEvent.js';
import ExtensionHandler from '../handlers/ExtensionHandler.js';
import deploy from '../functions/deploy.js';
import Cooldowns from '../models/Cooldowns.js';

export default class XernerxClient<T = unknown> extends Client {
	public declare readonly settings;
	public declare readonly config: T;
	public declare readonly commands: XernerxCommands;
	public declare readonly events: Collection<string, XernerxEvent<keyof XernerxClientEvents>>;
	public declare readonly inhibitors: Collection<string, XernerxInhibitor>;
	public declare readonly modules: ModuleOptions;
	public declare readonly util: ClientUtil;
	public declare readonly stats: Record<string, number>;
	public declare readonly cache: XernerxCache;
	public declare readonly cooldowns: Cooldowns;
	public declare readonly dbl: any;

	public constructor(discordOptions: ClientOptions, xernerxOptions: XernerxOptions, config?: T) {
		super(discordOptions);

		this.settings = z
			.object({
				local: z.string(),
				global: z.boolean().default(false).optional(),
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

		this.config = config as T;

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
		} as const;
	}

	public async connect(token: string) {
		const login = this.login(token); // TODO add thing to catch and have better error message

		deploy(this);

		if (this.settings.ceaseless) {
			process.on('unhandledRejection', (error) => {
				new XernerxLog(this).error('An uncaught error happpened, this is triggered from the ceaseless setting.', error);
			});
		}

		new XernerxLog(this).ready();

		return login;
	}
}
