/** @format */
import Discord from 'discord.js';
import { XernerxClientType, XernerxMessageContextInteraction, XernerxSlashInteraction, XernerxUserContextInteraction } from '../types/extenders.js';
import { SlashCommandArguments, SlashCommandOptions } from '../types/interfaces.js';
import { XernerxInteraction } from '../types/types.js';
import InteractionUtil from '../utils/InteractionUtil.js';
export default class XernerxSlashCommand {
	readonly id: string;
	readonly data: Discord.SlashCommandBuilder;
	readonly name: string;
	readonly description: string;
	readonly usage: string | null | undefined;
	readonly info: string | null | undefined;
	readonly category: string | null | undefined;
	readonly cooldown: number | null | undefined;
	readonly channel:
		| (
				| 'GuildText'
				| 'DM'
				| 'GuildVoice'
				| 'GroupDM'
				| 'GuildCategory'
				| 'GuildAnnouncement'
				| 'AnnouncementThread'
				| 'PublicThread'
				| 'PrivateThread'
				| 'GuildStageVoice'
				| 'GuildDirectory'
				| 'GuildForum'
				| 'GuildMedia'
				| 'GuildNews'
				| 'GuildNewsThread'
				| 'GuildPublicThread'
				| 'GuildPrivateThread'
		  )[]
		| null;
	readonly global: boolean | undefined;
	readonly ignore:
		| {
				owner?: boolean;
				users?: Array<string>;
				channels?: Array<string>;
				guilds?: Array<string>;
				voice?: boolean;
		  }
		| undefined;
	readonly strict:
		| {
				owner?: boolean;
				users?: Array<string>;
				channels?: Array<string>;
				guilds?: Array<string>;
				voice?: boolean;
		  }
		| undefined;
	readonly permissions:
		| {
				user?: Array<import('../types/types.js').PermissionNames> | Array<string> | null;
				client?: Array<import('../types/types.js').PermissionNames> | Array<string> | null;
				dm?: boolean;
		  }
		| undefined;
	readonly defer:
		| {
				reply?: boolean;
				ephemeral?: boolean;
				fetchReply?: boolean;
		  }
		| undefined;
	readonly filetype: 'SlashCommand';
	readonly filepath: string;
	readonly client: XernerxClientType;
	snowflake: string | null;
	util: InteractionUtil;
	constructor(id: string, options: SlashCommandOptions);
	/**
	 * @description autocomplete let's you add choices to string option arguments
	 * @param interaction - The interaction event emitted on this command
	 * @param focused - The command option that is in focus
	 * @param options - The full list of options on the command
	 */
	autocomplete<T>(interaction: XernerxInteraction<XernerxSlashInteraction | XernerxUserContextInteraction | XernerxMessageContextInteraction>, focused: T, options: T[]): Promise<void | any | T>;
	/**
	 * @description Checks for conditions before running the command
	 * @param interaction - The interaction event emitted on this command
	 * @param options - The args, group and subcommand parsed on this command
	 */
	conditions<T>(
		interaction: XernerxInteraction<XernerxSlashInteraction | XernerxUserContextInteraction | XernerxMessageContextInteraction>,
		{ args, subcommand, group }: SlashCommandArguments
	): Promise<void | any | T>;
	/**
	 * @description Runs the execution rule
	 * @param interaction - The interaction event emitted on this command
	 * @param options - The args, group and subcommand parsed on this command
	 */
	exec<T>(
		interaction: XernerxInteraction<XernerxSlashInteraction | XernerxUserContextInteraction | XernerxMessageContextInteraction>,
		{ args, subcommand, group }: SlashCommandArguments
	): Promise<void | any | T>;
	private addArguments;
	private addSubcommands;
	private addSubcommandGroups;
}
