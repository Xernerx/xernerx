/** @format */

import { Client, ClientOptions, Collection, RESTGetAPISKUsResult } from 'discord.js';
import { ClusterClient, DjsDiscordClient, getInfo } from 'discord-hybrid-sharding';

import { CommandHandler } from '../handler/CommandHandler.js';
import { EventHandler } from '../handler/EventHandler.js';
import { XernerxClientOptions } from '../interfaces/XernerxClientOptions.js';
import { XernerxClientReadyEvent } from '../events/clientReady.js';
import { XernerxClientStats } from '../interfaces/XernerxClientStats.js';
import { XernerxContextCommandBuilder } from '../build/XernerxContextCommandBuilder.js';
import { XernerxContextCommandHandlerOptions } from '../interfaces/XernerxContextCommandHandlerOptions.js';
import { XernerxError } from '../tools/XernerxError.js';
import { XernerxEventBuilder } from '../build/XernerxEventBuilder.js';
import { XernerxInfo } from '../tools/XernerxInfo.js';
import { XernerxInitial } from '../tools/XernerxInitial.js';
import { XernerxMessageCommandBuilder } from '../build/XernerxMessageCommandBuilder.js';
import { XernerxMessageCommandHandlerOptions } from '../interfaces/XernerxMessageCommandHandlerOptions.js';
import { XernerxMessageEvent } from '../events/XernerxMessage.js';
import { XernerxMonitisation } from '../model/XernerxMonitisation.js';
import { XernerxSlashCommandBuilder } from '../build/XernerxSlashCommandBuilder.js';
import { XernerxSlashCommandHandlerOptions } from '../interfaces/XernerxSlashCommandHandlerOptions.js';
import { XernerxSuccess } from '../tools/XernerxSuccess.js';
import sharpyy from 'sharpyy';
import z from 'zod';

export class XernerxClient extends Client {
	// Config
	declare public readonly token: string;
	declare public readonly sharded: boolean;
	declare public shardId: number | null;
	declare public readonly settings: XernerxClientOptions;
	declare public readonly premium: {
		owners?: boolean;
		consume?: boolean;
		synchronize?: boolean;
	};

	// Setup
	declare public readonly monitisation: { skus: RESTGetAPISKUsResult };
	declare public readonly stats: XernerxClientStats;
	declare public readonly cluster: ClusterClient | null;
	declare public readonly cache: { messages: Collection<string, string>; slash: Collection<string, string> };
	declare public readonly handler: { message: XernerxMessageCommandHandlerOptions; slash: XernerxSlashCommandHandlerOptions; context: XernerxContextCommandHandlerOptions };

	// Collections
	declare public readonly commands: {
		message: Collection<string, XernerxMessageCommandBuilder>;
		slash: Collection<string, XernerxSlashCommandBuilder>;
		context: Collection<string, XernerxContextCommandBuilder>;
	};
	declare public readonly events: Collection<string, XernerxEventBuilder>;

	// Handlers
	declare public readonly modules: { eventHandler: EventHandler; commandHandler: CommandHandler };

	constructor(options: ClientOptions & XernerxClientOptions) {
		try {
			options.shards = getInfo().SHARD_LIST;
			options.shardCount = getInfo().TOTAL_SHARDS;
		} catch {
			new XernerxInitial('Client');
		}

		super(options);

		this.settings = z
			.object({
				token: z.string(),
				global: z.boolean().default(false),
				guildId: z.string().or(z.array(z.string()).max(5)).default([]),
				owners: z.string().or(z.array(z.string()).max(5)).default([]),
				premium: z
					.object({
						owners: z.boolean().default(false),
						consume: z.boolean().default(false),
						synchronize: z.boolean().default(false),
					})
					.optional(),
			})
			.parse(options);

		this.sharded = options.shardCount ? true : false;
		this.shardId = null;
		this.token = options.token as string;

		this.settings.guildId = typeof this.settings.guildId == 'string' ? [this.settings.guildId] : this.settings.guildId;
		this.settings.owners = typeof this.settings.owners == 'string' ? [this.settings.owners] : this.settings.owners;

		this.premium = this.settings.premium || {
			owners: false,
			consume: false,
			synchronize: false,
		};

		delete this.settings.premium;

		this.monitisation = { skus: [] };

		this.stats = {
			onlineSince: Number(new Date()),
			guildCount: null,
			userCount: null,
			shardCount: null,
			voteCount: null,
			shard: null,
			shards: [],
		};

		this.cache = { messages: new Collection(), slash: new Collection() };

		this.handler = {
			message: { directory: null },
			slash: { directory: null },
			context: { directory: null },
		};

		this.commands = { message: new Collection(), slash: new Collection(), context: new Collection() };

		this.events = new Collection();

		if (this.sharded) this.cluster = new ClusterClient(this as unknown as DjsDiscordClient);

		this.modules = { eventHandler: new EventHandler(this), commandHandler: new CommandHandler(this) };

		this.modules.eventHandler.loadBuilder(XernerxMessageEvent, XernerxClientReadyEvent);

		(process as any).xernerx = {
			id: this.cluster?.id,
			global: this.settings.global,
		};
	}

	/**
	 * Connects the client to Discord and initializes various client statistics and handlers.
	 *
	 * @returns A promise that resolves when the client successfully logs in, or rejects with an error message if the login fails.
	 */
	async connect() {
		this.on('clientReady', async (client) => {
			new XernerxInfo(`Signing in as ${sharpyy(client.user?.tag, 'txBlue')}...`);

			this.monitisation.skus = await new XernerxMonitisation(client).sku();

			/** When the client is sharded */
			if (this.sharded && this.cluster) {
				this.stats.shard = {
					shardId: this.cluster.id,
					onlineSince: Number(new Date()),
					guildCount: null,
					userCount: null,
				};

				setInterval(async () => {
					if (!this.cluster || !this.stats.shard) return;

					this.stats.guildCount = (await this.cluster.broadcastEval('this.guilds.cache.size')).reduce((a, b) => a + b, 0);
					this.stats.userCount = (await this.cluster.broadcastEval('this.guilds.cache.map((a) => a.memberCount).reduce((a, b) => a + b, 0)')).reduce((a, b) => a + b, 0);
					this.stats.shardCount = getInfo().TOTAL_SHARDS;
					this.stats.shard.guildCount = client.guilds.cache.size;
					this.stats.voteCount = 0;
					this.stats.shard.userCount = client.guilds.cache.map((a) => a.memberCount).reduce((a, b) => a + b, 0);
				}, 1000);

				await new Promise((resolve) => setTimeout(resolve, 2000));

				new XernerxSuccess(
					`Signed in as ${sharpyy(client.user?.tag, 'txBlue')}, watching ${sharpyy(String(this.stats.shard?.guildCount?.toLocaleString()), 'txCyan')} guilds and users: ${sharpyy(String(this.stats.shard?.userCount?.toLocaleString()), 'txCyan')}`
				);
			} else {
				/** When the client is standalone */
				setInterval(() => {
					this.stats.guildCount = client.guilds.cache.size;
					this.stats.userCount = client.guilds.cache.map((a) => a.memberCount).reduce((a, b) => a + b, 0);
					this.stats.voteCount = 0;
					this.stats.shardCount = 0;
				}, 1000);

				await new Promise((resolve) => setTimeout(resolve, 2000));

				new XernerxSuccess(
					`Signed in as ${sharpyy(client.user?.tag, 'txBlue')}, watching ${sharpyy(String(this.stats.guildCount?.toLocaleString()), 'txCyan')} guilds and users: ${sharpyy(String(this.stats.userCount?.toLocaleString()), 'txCyan')}`
				);
			}
		});

		return await this.login(this.token).catch((error) => new XernerxError(error.message, 1));
	}
}
