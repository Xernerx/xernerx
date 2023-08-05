/** @format */

import { ShardingManager, ShardingManagerOptions, Guild, ClientUser } from 'discord.js';
import XernerxLog from '../tools/XernerxLog.js';
import { Style } from 'dumfunctions';

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

		this.stats = { guildCount: 0, userCount: 0, shardCount: 0 };

		this.user = null;

		this.on('shardCreate', async (shard) => {
			shard
				.on('ready', async () => {
					const guilds = (await shard.fetchClientValue('guilds.cache')) as Array<Guild>;
					const guildCount = guilds.length;
					const userCount = guilds.map((guild) => guild.memberCount).length ? guilds.map((guild) => guild.memberCount).reduce((a, b) => (a += b)) : 0;

					this.user = (await shard.fetchClientValue('user')) as ClientUser;

					this.stats.guildCount += Number(guildCount);

					this.stats.userCount += Number(userCount);

					this.stats.shardCount++;

					await new XernerxLog({ settings: xernerxOptions } as never).info(
						`Launched shard ${Style.log(String(shard.id), { color: Style.TextColor.Cyan })} for ${Style.log(this.user?.tag, { color: Style.TextColor.Blue })}!`
					);
				})
				.on('error', (error) => {
					new XernerxLog({ settings: xernerxOptions } as never).info(
						`An error occurred in ${Style.log(String(shard.id), { color: Style.TextColor.Cyan })} for ${Style.log(String(this.user?.tag), { color: Style.TextColor.Blue })}! ${error}`
					);
				});

			if (xernerxOptions?.timeout) setTimeout(() => shard.kill(), xernerxOptions.timeout);
		});

		const spawn = this.spawn();

		this.spawner = spawn;

		spawn.then(async (shards) => {
			const collector = setInterval(() => {
				const index = shards.size - 1;

				if (shards.get(index)?.ready) {
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

					clearInterval(collector);
				}
			}, 1000);
		});

		return this;
	}
}
