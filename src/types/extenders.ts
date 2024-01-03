/** @format */

import {
	ChatInputCommandInteraction,
	Collection,
	DMChannel,
	Guild,
	GuildChannel,
	GuildMember,
	Message,
	MessageContextMenuCommandInteraction,
	User,
	UserContextMenuCommandInteraction,
} from 'discord.js';

import InteractionUtil from '../utils/InteractionUtil.js';
import MessageUtil from '../utils/MessageUtil.js';
import { ModuleOptions, XernerxCache, XernerxCommands } from '../types/interfaces.js';
import XernerxEvent from '../build/XernerxEvent.js';
import XernerxInhibitor from '../build/XernerxInhibitor.js';
import XernerxClient from '../client/XernerxClient.js';
import ClientUtil from '../utils/ClientUtil.js';

export interface XernerxUser extends User {
	owner: boolean;
	voted: boolean | null;
}

export interface XernerxMember extends GuildMember {
	username: string;
}

export interface XernerxGuild extends Guild {}

export interface XernerxGuildChannel extends GuildChannel {}

export interface XernerxDMChannel extends DMChannel {}

interface XernerxCommand {}

export interface XernerxMessage extends Message, XernerxCommand {
	user: XernerxUser;
	util: MessageUtil;
}

export interface XernerxSlashInteraction extends ChatInputCommandInteraction, XernerxCommand {
	user: XernerxUser;
	util: InteractionUtil;
}

export interface XernerxUserContextInteraction extends UserContextMenuCommandInteraction, XernerxCommand {
	user: XernerxUser;
	util: InteractionUtil;
}

export interface XernerxMessageContextInteraction extends MessageContextMenuCommandInteraction, XernerxCommand {
	user: XernerxUser;
	util: InteractionUtil;
}

export interface XernerxClientType extends XernerxClient {
	commands: XernerxCommands;

	events: Collection<string, XernerxEvent>;

	inhibitors: Collection<string, XernerxInhibitor>;

	modules: ModuleOptions;

	util: ClientUtil;

	stats: {
		guildCount: number;
		userCount: number;
		shardId: number;
		shardCount: number;
	};

	cooldown: {
		default: number;
		cache: number;
		collections: Array<string>;
	};

	cache: XernerxCache;

	connect: () => Promise<string>;
}
