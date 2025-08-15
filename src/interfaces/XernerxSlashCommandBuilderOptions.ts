/** @format */

export interface XernerxSlashCommandBuilderOptions {
	name: string;
	description: string;
	global?: boolean;
	guildId?: string | Array<string>;
	options?: any;
	subcommands?: any;
	groups?: any;
}
