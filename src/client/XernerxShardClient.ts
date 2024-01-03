/** @format */

import { ShardingManager, ShardingManagerOptions, ClientUser } from 'discord.js';
import { Style } from 'dumfunctions';

import XernerxLog from '../tools/XernerxLog.js';
import XernerxClient from './XernerxClient.js';

interface XernerxOptions {
	log?: {
		info?: boolean;
	};
	timeout?: number;
}

export default class XernerxShardClient extends ShardingManager {
	public declare readonly stats;
	public declare user: ClientUser | null;
	public declare spawner;

	constructor(file: string, discordOptions: ShardingManagerOptions, xernerxOptions?: XernerxOptions) {
		super(file, discordOptions);

		this.stats = { guildCount: 0, userCount: 0, shardCount: 0, voteCount: 0, shards: {} };

		this.user = null;

		this.on('shardCreate', async (shard) => {
			shard
				.on('ready', async () => {
					await new Promise((resolve) => setTimeout(resolve, 250));

					const stats = (await shard.fetchClientValue('stats')) as Record<string, number>;

					(this.stats.shards as any)[String(shard.id)] = stats;

					this.user = (await shard.fetchClientValue('user')) as ClientUser;

					this.stats.guildCount += stats.guildCount;

					this.stats.userCount += stats.userCount;

					this.stats.shardCount++;

					this.stats.voteCount = stats.voteCount;

					await new XernerxLog({ settings: xernerxOptions } as never).info(
						`Launched shard ${Style.log(String(shard.id), { color: Style.TextColor.Cyan })} for ${Style.log(this.user?.tag, { color: Style.TextColor.Blue })}! ${
							xernerxOptions?.timeout ? `Automatically killing in ${Style.log(String(xernerxOptions.timeout), { color: Style.TextColor.Cyan })}ms.` : ''
						}`
					);
				})
				.on('error', (error) => {
					new XernerxLog({ settings: xernerxOptions } as never).info(
						`An error occurred in ${Style.log(String(shard.id), { color: Style.TextColor.Cyan })} for ${Style.log(String(this.user?.tag), { color: Style.TextColor.Blue })}! ${error}`
					);
				});

			if (xernerxOptions?.timeout)
				setTimeout(() => {
					new XernerxLog({ settings: xernerxOptions } as never).warn(
						`Automatically killing shard ${Style.log(String(shard.id), { color: Style.TextColor.Cyan })} on ${Style.log(String((shard.manager as XernerxClient & ShardingManager).user?.tag), {
							color: Style.TextColor.Blue,
						})}!`
					);

					shard.kill();
				}, xernerxOptions.timeout);
		});

		const spawn = this.spawn();

		this.spawner = spawn;

		spawn.then(async (shards) => {
			const collector = setInterval(() => {
				const index = shards.size - 1;

				if (shards.get(index)?.ready) {
					clearInterval(collector);

					new XernerxLog({ settings: xernerxOptions } as never).info(
						`All Shards launched for ${Style.log(String(this.user?.tag), {
							color: Style.TextColor.Blue,
						})} with a total of ${Style.log(String(this.stats.shardCount), { color: Style.TextColor.Cyan })} shard${this.stats.shardCount > 1 ? 's' : ''}, watching ${Style.log(
							String(this.stats.guildCount),
							{
								color: Style.TextColor.Cyan,
							}
						)} guild${this.stats.guildCount > 1 ? 's' : ''}, and ${Style.log(String(this.stats.userCount), { color: Style.TextColor.Cyan })} user${this.stats.userCount > 1 ? 's' : ''}!`
					);
				}
			}, 1000);
		});

		return this;
	}
}
