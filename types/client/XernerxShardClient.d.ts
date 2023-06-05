import { ShardingManager, ShardingManagerOptions, ClientUser } from 'discord.js';
interface XernerxOptions {
    log?: {
        ready?: boolean;
    };
}
export default class XernerxShardClient extends ShardingManager {
    readonly stats: {
        guildCount: number;
        userCount: number;
        shardCount: number;
    };
    user: ClientUser | null;
    constructor(file: string, discordOptions: ShardingManagerOptions, xernerxOptions?: XernerxOptions);
}
export {};
//# sourceMappingURL=XernerxShardClient.d.ts.map