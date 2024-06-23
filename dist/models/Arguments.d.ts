/** @format */
import XernerxSlashCommand from '../build/XernerxSlashCommand.js';
import XernerxContextCommand from '../build/XernerxContextCommand.js';
import MessageCommandBuilder from '../build/XernerxMessageCommand.js';
import { XernerxMessage, XernerxMessageContextInteraction, XernerxSlashInteraction, XernerxUserContextInteraction } from '../types/extenders.js';
import { MessageCommandArguments } from '../types/interfaces.js';
import { XernerxInteraction } from '../types/types.js';
export declare function messageArguments(message: XernerxMessage, command: MessageCommandBuilder, prefix: string): Promise<MessageCommandArguments>;
export declare function interactionArguments(
	interaction: XernerxInteraction<XernerxSlashInteraction | XernerxUserContextInteraction | XernerxMessageContextInteraction> | any,
	command: XernerxContextCommand | XernerxSlashCommand
): Promise<any>;
