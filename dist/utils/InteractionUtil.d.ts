/** @format */
import { EmbedBuilder, InteractionEditReplyOptions, InteractionReplyOptions, MessageCreateOptions, MessagePayload } from 'discord.js';
import XernerxClient from '../client/XernerxClient.js';
import { ContextCommandArguments, PaginatorOptions, SlashCommandArguments } from '../types/interfaces.js';
import { PermissionNames, XernerxInteraction } from '../types/types.js';
import Util from './Util.js';
import { XernerxMessageContextInteraction, XernerxSlashInteraction, XernerxUser, XernerxUserContextInteraction } from '../types/extenders.js';
type MimicOptions = {
	timeout: number;
};
export default class InteractionUtil extends Util {
	private readonly interaction;
	parsed: {
		alias: string | null;
		args: (SlashCommandArguments | ContextCommandArguments<'message' | 'user'>) | null;
	};
	constructor(client: XernerxClient, interaction: XernerxInteraction<XernerxSlashInteraction | XernerxUserContextInteraction | XernerxMessageContextInteraction>);
	send(content: any): Promise<import('discord.js').Message<false> | import('discord.js').Message<true> | undefined>;
	reply(content: string | MessagePayload | InteractionReplyOptions | InteractionEditReplyOptions): Promise<import('discord.js').InteractionResponse<boolean> | import('discord.js').Message<boolean>>;
	mimic(user: XernerxUser | string, interaction: MessageCreateOptions, options: MimicOptions): Promise<void>;
	paginator(embeds: Array<EmbedBuilder>, options?: PaginatorOptions): Promise<void | import('discord.js').Message<false> | import('discord.js').Message<true>>;
	commands(): import('discord.js').Collection<string, import('../main.js').XernerxSlashCommand> | import('discord.js').Collection<string, import('../main.js').XernerxContextCommand>;
	permissionCheck(type: 'user' | 'client', permissions: Array<PermissionNames>, emit?: boolean): boolean | string[];
}
export {};
