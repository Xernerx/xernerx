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

		this.on('clusterCreate', (cluster) => {
			new XernerxInfo(`${sharpyy(`Shard ${cluster.id}`, 'txCyan')} | Creating...`);

			cluster.on('ready', () => {
				this.onlineShards.add(cluster);

				if (this.onlineShards.size == this.totalShards) {
					new XernerxSuccess(`All Shards are online!`);

					cluster.send({ type: 'xernerx', ready: true });
				}
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
}
