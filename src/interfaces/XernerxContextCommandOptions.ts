/** @format */

import { Message, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction } from 'discord.js';

import { XernerxContextCommandBuilder } from '../build/XernerxContextCommandBuilder.js';
import { XernerxUser } from '../model/XernerxUser.js';

type BaseOptions = {
	command: XernerxContextCommandBuilder;
};

export type XernerxContextCommandOptions<T extends 'message' | 'user'> = T extends 'user'
	? BaseOptions & {
			interaction: UserContextMenuCommandInteraction;
			user: XernerxUser;
		}
	: BaseOptions & {
			interaction: MessageContextMenuCommandInteraction;
			message: Message;
		};
