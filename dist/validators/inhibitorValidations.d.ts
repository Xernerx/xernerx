/** @format */
import { ContextCommandArguments, MessageCommandArguments, SlashCommandArguments } from '../types/interfaces.js';
import XernerxContextCommand from '../build/XernerxContextCommand.js';
import XernerxMessageCommand from '../build/XernerxMessageCommand.js';
import XernerxSlashCommand from '../build/XernerxSlashCommand.js';
import { XernerxMessage, XernerxMessageContextInteraction, XernerxSlashInteraction, XernerxUserContextInteraction } from '../types/extenders.js';
import { InhibitorType, XernerxInteraction } from '../types/types.js';
export declare function inhibitorValidation(
	event: XernerxMessage | XernerxInteraction<XernerxSlashInteraction | XernerxUserContextInteraction | XernerxMessageContextInteraction>,
	args?: SlashCommandArguments | MessageCommandArguments | ContextCommandArguments<'user' | 'message'> | null,
	cmd?: XernerxContextCommand | XernerxMessageCommand | XernerxSlashCommand,
	type?: 'pre' | 'check' | 'post'
): Promise<boolean>;
export declare function inhibitorArguments(
	event: XernerxMessage | XernerxInteraction<XernerxSlashInteraction | XernerxUserContextInteraction | XernerxMessageContextInteraction>,
	cmd: XernerxContextCommand | XernerxMessageCommand | XernerxSlashCommand | null,
	type: InhibitorType
):
	| import('../types/extenders.js').XernerxUser
	| import('discord.js').GuildMember
	| import('discord.js').Guild
	| import('discord.js').TextBasedChannel
	| XernerxSlashCommand
	| XernerxContextCommand
	| XernerxMessageCommand
	| import('discord.js').APIInteractionGuildMember
	| null
	| undefined;
