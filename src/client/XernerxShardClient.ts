import { ShardingManager, ShardingManagerOptions, Guild, ClientUser } from 'discord.js';
import XernerxLog from '../tools/XernerxLog.js';

interface XernerxOptions {
    log?: {
        info?: boolean;
    };
}

export default class XernerxShardClient extends ShardingManager {
    public declare readonly stats;
    public declare user: ClientUser | null;

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

                    this.stats.guildCount += Number(guildCount);

                    this.stats.userCount += Number(userCount);

                    this.stats.shardCount++;

                    this.user = (await shard.fetchClientValue('user')) as ClientUser;

                    await new XernerxLog({ settings: xernerxOptions } as never).info(`Launched shard ${shard.id} for ${this.user?.tag}!`);
                })
                .on('error', (error) => {
                    new XernerxLog({ settings: xernerxOptions } as never).info(`An error occurred in ${shard.id} for ${this.user?.tag}! ${error}`);
                });
        });

        this.spawn().then(async (shards) => {
            const collector = setInterval(() => {
                const index = shards.size - 1;

                if (shards.get(index)?.ready) {
                    new XernerxLog({ settings: xernerxOptions } as never).info(
                        `Launched all ${this.stats.shardCount} shards for ${this.user?.tag}, watching ${this.stats.guildCount} guilds, and ${this.stats.userCount} users!`
                    );

                    clearInterval(collector);
                }
            }, 1000);
        });
    }
}
