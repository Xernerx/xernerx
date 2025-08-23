/** @format */

import { Client, ClientOptions, Collection, RESTGetAPISKUsResult } from 'discord.js';
import sharpyy from 'sharpyy';
import { ClusterClient, DjsDiscordClient, getInfo } from 'discord-hybrid-sharding';

import { XernerxClientOptions } from '../interfaces/XernerxClientOptions.js';
import { XernerxInfo } from '../tools/XernerxInfo.js';
import { XernerxClientStats } from '../interfaces/XernerxClientStats.js';
import { XernerxInitial } from '../tools/XernerxInitial.js';
import { XernerxError } from '../tools/XernerxError.js';
import { XernerxSuccess } from '../tools/XernerxSuccess.js';
import { XernerxMonitisation } from '../model/XernerxMonitisation.js';
import { EventHandler } from '../handler/EventHandler.js';
import { XernerxEventBuilder } from '../build/XernerxEventBuilder.js';
import { CommandHandler } from '../handler/CommandHandler.js';
import { XernerxMessageCommandBuilder } from '../build/XernerxMessageCommandBuilder.js';
import { XernerxMessageCommandHandlerOptions } from '../interfaces/XernerxMessageCommandHandlerOptions.js';
import { XernerxSlashCommandHandlerOptions } from '../interfaces/XernerxSlashCommandHandlerOptions.js';
import { XernerxSlashCommandBuilder } from '../build/XernerxSlashCommandBuilder.js';
import z from 'zod';

export class XernerxClient extends Client {
	// Config
	declare public readonly token: string;
	declare public readonly sharded: boolean;
	declare public readonly settings: XernerxClientOptions;

	// Setup
	declare public readonly monitisation: { skus: RESTGetAPISKUsResult };
	declare public readonly stats: XernerxClientStats;
	declare public readonly cluster: ClusterClient | null;
	declare public readonly cache: { messages: Collection<string, string>; slash: Collection<string, string> };
	declare public readonly handler: { message: XernerxMessageCommandHandlerOptions; slash: XernerxSlashCommandHandlerOptions };

	// Collections
	declare public readonly commands: {
		message: Collection<string, XernerxMessageCommandBuilder>;
		slash: Collection<string, XernerxSlashCommandBuilder>;
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
			})
			.parse(options);

		this.sharded = options.shardCount ? true : false;
		this.token = options.token as string;

		this.settings.guildId = typeof this.settings.guildId == 'string' ? [this.settings.guildId] : this.settings.guildId;

		this.monitisation = { skus: [] };

		this.stats = {
			guildCount: null,
			userCount: null,
			shardCount: null,
			shard: null,
			accurate: false,
		};

		this.cache = { messages: new Collection(), slash: new Collection() };

		this.handler = {
			message: { directory: null },
			slash: { directory: null },
		};

		this.commands = { message: new Collection(), slash: new Collection() };

		this.events = new Collection();

		if (this.sharded) this.cluster = new ClusterClient(this as unknown as DjsDiscordClient);

		this.modules = { eventHandler: new EventHandler(this), commandHandler: new CommandHandler(this) };
	}

	/**
	 * Connects the client to Discord and initializes various client statistics and handlers.
	 *
	 * @returns A promise that resolves when the client successfully logs in, or rejects with an error message if the login fails.
	 */
	async connect() {
		new XernerxInfo(`${this.cluster ? `${sharpyy(`Shard ${this.cluster.id}`, 'txCyan')} | ` : ''}Connecting...`);

		this.on('clientReady', async (client) => {
			this.monitisation.skus = await new XernerxMonitisation(client).sku();

			/** When the client is sharded */
			if (this.sharded && this.cluster) {
				process.on('message', () => true);

				this.stats.guildCount = (await this.cluster.broadcastEval('this.guilds.cache.size')).reduce((a, b) => a + b, 0);
				this.stats.userCount = (await this.cluster.broadcastEval('this.guilds.cache.map((a) => a.memberCount).reduce((a, b) => a + b, 0)')).reduce((a, b) => a + b, 0);
				this.stats.shard = {
					guildCount: client.guilds.cache.size,
					userCount: client.guilds.cache.map((a) => a.memberCount).reduce((a, b) => a + b, 0),
				};

				new XernerxSuccess(
					`${sharpyy(`Shard ${this.cluster.id}`, 'txCyan')} | Signed in as ${sharpyy(client.user?.tag, 'txBlue')}, watching ${sharpyy(String(this.stats.shard.guildCount), 'txCyan')} guilds and users: ${sharpyy(String(this.stats.shard.userCount), 'txCyan')}`
				);
			} else {
				/** When the client is standalone */

				this.stats.guildCount = client.guilds.cache.size;
				this.stats.userCount = client.guilds.cache.map((a) => a.memberCount).reduce((a, b) => a + b, 0);
				this.stats.shardCount = 0;
				this.stats.accurate = true;

				new XernerxSuccess(
					`Signed in as ${sharpyy(client.user?.tag, 'txBlue')}, watching ${sharpyy(String(this.stats.guildCount), 'txCyan')} guilds and users: ${sharpyy(String(this.stats.userCount), 'txCyan')}`
				);
			}
		});

		return await this.login(this.token).catch((error) => new XernerxError(error.message, 1));
	}
}
