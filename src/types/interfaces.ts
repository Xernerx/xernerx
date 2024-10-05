/** @format */

export interface XernerxStats {
	guilds: null | number;
	users: null | number;
	shardId: null | number;
	shardCount: null | number;
	shards: null | number;
	voteCount: null | number;
	votes: null | number;
}

export interface XernerxSlashCommandHandlerOptions {
	directory: string;
	global: boolean;
}

export interface XernerxMessageCommandHandlerOptions {
	directory: string;
	global: boolean;
}
export interface XernerxContextCommandHandlerOptions {
	directory: string;
	global: boolean;
}
