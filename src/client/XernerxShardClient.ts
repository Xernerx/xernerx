/** @format */

import { Cluster, ClusterManager, ClusterManagerOptions } from 'discord-hybrid-sharding';
import sharpyy from 'sharpyy';
import fs from 'fs';

import { XernerxInfo } from '../tools/XernerxInfo.js';
import { XernerxError } from '../tools/XernerxError.js';
import { XernerxSuccess } from '../tools/XernerxSuccess.js';
import { XernerxShardClientOptions } from '../interfaces/XernerxShardClientOptions.js';
import { XernerxInitial } from '../tools/XernerxInitial.js';

export class XernerxShardClient extends ClusterManager {
	declare public readonly onlineShards: Set<Cluster>;
	declare public readonly stats: {
		onlineSince: number | null;
		guildCount: number | null;
		userCount: number | null;
		shardCount: number | null;
		voteCount: number | null;
		shards: [] | null;
	};
	constructor(options: ClusterManagerOptions & XernerxShardClientOptions) {
		new XernerxInitial('ShardClient');

		try {
			new XernerxInfo(`Loading ShardClient from ${sharpyy(options.file, 'bgGray')}`);
			(fs.readFileSync(options.file), 'utf-8');
			new XernerxSuccess(`ShardClient loaded successfully`);
		} catch {
			new XernerxError(`File ${sharpyy(options.file, 'bgGray')} not found.`, 1);
		}

		super(options.file, options);

		this.onlineShards = new Set();

		this.stats = {
			onlineSince: Number(new Date()),
			guildCount: null,
			userCount: null,
			shardCount: null,
			voteCount: null,
			shards: [],
		};

		this.on('clusterCreate', (cluster) => {
			new XernerxInfo(`${sharpyy(`Shard ${cluster.id}`, 'txCyan')} | Creating...`);

			cluster.on('ready', () => {
				this.onlineShards.add(cluster);

				if (this.onlineShards.size == (this.totalClusters || this.totalShards)) this.#update();
			});

			cluster.on('disconnect', () => {
				this.onlineShards.delete(cluster);
			});

			cluster.on('death', (error) => {
				this.onlineShards.delete(cluster);
			});
		});

		this.spawn({ timeout: -1 });
	}

	async #update() {
		await new Promise((resolve) => setTimeout(resolve, 1000));

		setInterval(async () => {
			const stats = await this.fetchClientValues('stats');

			const shards = await this.fetchClientValues('stats.shard');

			this.stats.guildCount = stats[0].guildCount;
			this.stats.userCount = stats[0].userCount;
			this.stats.shardCount = stats[0].shardCount;
			this.stats.voteCount = stats[0].voteCount;
			this.stats.shards = shards;
		}, 1000);

		await new Promise((resolve) => setTimeout(resolve, 4000));

		new XernerxSuccess(
			`All Shards are online! Watching ${sharpyy(String(this.stats.guildCount?.toLocaleString()), 'txCyan')} guilds and users: ${sharpyy(String(this.stats.userCount?.toLocaleString()), 'txCyan')}, and ${sharpyy(String(this.stats.shardCount?.toLocaleString()), 'txCyan')} shards.`
		);
	}
}
