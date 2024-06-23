/** @format */
import XernerxContextCommand from '../build/XernerxContextCommand.js';
import MessageCommandBuilder from '../build/XernerxMessageCommand.js';
import XernerxSlashCommand from '../build/XernerxSlashCommand.js';
import { XernerxMessage, XernerxSlashInteraction, XernerxUserContextInteraction } from '../types/extenders.js';
import { XernerxInteraction } from '../types/types.js';
export default function commandValidation(
	event: XernerxInteraction<XernerxSlashInteraction | XernerxUserContextInteraction | XernerxUserContextInteraction> | XernerxMessage,
	command: MessageCommandBuilder | XernerxSlashCommand | XernerxContextCommand
): Promise<boolean>;
