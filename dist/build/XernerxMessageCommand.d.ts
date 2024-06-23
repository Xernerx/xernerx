/** @format */
import { XernerxClientType, XernerxMessage } from '../types/extenders.js';
import { MessageCommandArguments, MessageCommandOptions } from '../types/interfaces.js';
import MessageUtil from '../utils/MessageUtil.js';
export default class XernerxMessageCommand {
	readonly id: string;
	readonly name: string;
	readonly aliases: string[] | undefined;
	readonly regex: RegExp | undefined;
	readonly prefix: string | string[] | undefined;
	readonly description: string | null | undefined;
	readonly usage: string | null | undefined;
	readonly info: string | null | undefined;
	readonly separator: string | undefined;
	readonly args: import('../types/interfaces.js').MessageCommandArgumentOptions[] | undefined;
	readonly flags: import('../types/interfaces.js').MessageCommandFlagOptions[] | undefined;
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
	readonly filetype: 'MessageCommand';
	readonly filepath: string;
	readonly client: XernerxClientType;
	snowflake: string | null;
	util: MessageUtil;
	constructor(id: string, options: MessageCommandOptions);
	/**
	 * @description Checks for conditions before running the command
	 * @param message - The message event emitted on this command
	 * @param options - The args and flags parsed on this command
	 */
	conditions(message: XernerxMessage, { args, flags }: MessageCommandArguments): Promise<any>;
	/**
	 * @description Runs the execution rule
	 * @param message - The message event emitted on this command
	 * @param options - The args and flags parsed on this command
	 */
	exec(message: XernerxMessage, { args, flags }: MessageCommandArguments): Promise<any>;
}
