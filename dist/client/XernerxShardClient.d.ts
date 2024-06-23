/** @format */
import { ShardingManager, ShardingManagerOptions, ClientUser } from 'discord.js';
interface XernerxOptions {
	log?: {
		info?: boolean;
	};
	timeout?: number;
}
export default class XernerxShardClient extends ShardingManager {
	readonly stats: {
		guildCount: number;
		userCount: number;
		shardCount: number;
		voteCount: number;
		shards: {};
	};
	user: ClientUser | null;
	spawner: Promise<import('discord.js').Collection<number, import('discord.js').Shard>>;
	constructor(file: string, discordOptions: ShardingManagerOptions, xernerxOptions?: XernerxOptions, data?: unknown);
}
export {};
