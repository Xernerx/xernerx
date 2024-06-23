/** @format */
import { ContextMenuCommandBuilder } from 'discord.js';
import { XernerxMessageContextInteraction, XernerxUserContextInteraction, XernerxClientType } from '../types/extenders.js';
import { ContextCommandArguments, ContextCommandOptions } from '../types/interfaces.js';
import InteractionUtil from '../utils/InteractionUtil.js';
export default class XernerxContextCommand {
	readonly id: string;
	readonly data: ContextMenuCommandBuilder;
	readonly name: string;
	readonly type: 'user' | 'message';
	readonly description: string | null | undefined;
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
				user?: Array<import('../main.js').PermissionNames> | Array<string> | null;
				client?: Array<import('../main.js').PermissionNames> | Array<string> | null;
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
	readonly filetype: 'ContextCommand';
	readonly filepath: string;
	readonly client: XernerxClientType;
	util: InteractionUtil;
	snowflake: string | null;
	constructor(id: string, options: ContextCommandOptions);
	/**
	 * @description the execution of the command
	 * @param interaction - Interaction event emitted on command
	 * @param args - The arguments parsed with the command, if any
	 */
	exec(interaction: XernerxUserContextInteraction | XernerxMessageContextInteraction, args: ContextCommandArguments<'user' | 'message'>): Promise<any>;
}
