/** @format */

export interface XernerxClientStats {
	guildCount: number | null;
	userCount: number | null;
	shardCount: number | null;

	shard: {
		guildCount: number | null;
		userCount: number | null;
	} | null;
	accurate: boolean;
}
