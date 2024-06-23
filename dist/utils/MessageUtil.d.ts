/** @format */
import { EmbedBuilder, MessageCreateOptions, MessageEditOptions, MessagePayload, MessageReplyOptions } from 'discord.js';
import XernerxClient from '../client/XernerxClient.js';
import { XernerxMessage, XernerxUser } from '../types/extenders.js';
import Util from './Util.js';
import { PaginatorOptions } from '../types/interfaces.js';
import { PermissionNames } from '../main.js';
type MimicOptions = {
	timeout: number;
};
export default class MessageUtil extends Util {
	private readonly message;
	parsed: {
		alias: string | null;
		prefix: string | null;
		args: Record<string, unknown> | null;
	};
	constructor(client: XernerxClient, message: XernerxMessage);
	send(content: any): Promise<import('discord.js').Message<boolean> | null>;
	reply(content: string | MessagePayload | MessageReplyOptions | MessageEditOptions): Promise<import('discord.js').Message<boolean> | null>;
	mimic(user: XernerxUser | string, message: MessageCreateOptions, options: MimicOptions): Promise<void>;
	paginator(embeds: Array<EmbedBuilder>, options?: PaginatorOptions): Promise<void | import('discord.js').Message<boolean> | null>;
	commands(): import('discord.js').Collection<string, import('../main.js').XernerxMessageCommand>;
	permissionCheck(type: 'user' | 'client', permissions: Array<PermissionNames>, emit?: boolean): boolean | string[];
}
export {};
