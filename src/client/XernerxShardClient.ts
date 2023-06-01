import { ShardingManager, ShardingManagerOptions, Guild } from 'discord.js';
import XernerxLog from '../tools/XernerxLog.js';

interface XernerxOptions {
    log?: {
        ready: boolean;
    };
}

export default class XernerxShardClient extends ShardingManager {
    public declare readonly stats;

    constructor(file: string, discordOptions: ShardingManagerOptions, xernerxOptions?: XernerxOptions) {
        super(file, discordOptions);

        this.stats = { guildCount: 0, userCount: 0, shardCount: 0 };

        this.on('shardCreate', async (shard) => {
            new XernerxLog({ settings: xernerxOptions } as never).info(`Launching shard ${shard.id}`);

            shard.on('ready', async () => {
                const guilds = (await shard.fetchClientValue('guilds.cache')) as Array<Guild>;
                const guildCount = guilds.length;
                const userCount = guilds.map((guild) => guild.memberCount).length ? guilds.map((guild) => guild.memberCount).reduce((a, b) => (a += b)) : 0;

                this.stats.guildCount += Number(guildCount);

                this.stats.userCount += Number(userCount);

                this.stats.shardCount++;
            });
        });

        this.spawn().then(async (shards) => {
            const collector = setInterval(() => {
                const index = shards.size - 1;

                if (shards.get(index)?.ready) {
                    new XernerxLog({ settings: xernerxOptions } as never).info(
                        `Launched all ${this.stats.shardCount} shards, watching ${this.stats.guildCount} guilds, and ${this.stats.userCount} users!`
                    );

                    clearInterval(collector);
                }
            }, 1000);
        });
    }
}
