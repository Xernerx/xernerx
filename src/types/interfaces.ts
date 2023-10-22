/** @format */

import { ActivityType, ChannelType, Collection, PresenceStatusData } from 'discord.js';

import CommandHandler from '../handlers/CommandHandler.js';
import EventHandler from '../handlers/EventHandler.js';
import InhibitorHandler from '../handlers/InhibitorHandler.js';
import WebhookHandler from '../handlers/WebhookHandler.js';
import XernerxContextCommand from '../build/XernerxContextCommand.js';
import MessageCommandBuilder from '../build/XernerxMessageCommand.js';
import XernerxSlashCommand from '../build/XernerxSlashCommand.js';
import { Locales, MessageCommandArgumentType, PermissionNames, SlashCommandArgumentType, XernerxEventType, InhibitorType } from './types.js';
import ExtensionHandler from '../handlers/ExtensionHandler.js';
import { XernerxMessage, XernerxUser } from './extenders.js';

export interface XernerxOptions {
	local: string;
	global?: boolean;
	ownerId?: string | Array<string>;
	ceaseless?: boolean;
	permissions?: {
		user?: Array<PermissionNames> | Array<string> | null;
		client?: Array<PermissionNames> | Array<string> | null;
		dm?: boolean;
	};
	ignore?: {
		owner?: boolean;
		self?: boolean;
		bots?: boolean;
		system?: boolean;
		users?: Array<string>;
		channels?: Array<string>;
		guilds?: Array<string>;
	};
	log?: {
		ready?: boolean;
		info?: boolean;
		warn?: boolean;
		error?: boolean;
		table?: Array<'name' | 'aliases' | 'description' | 'filetype' | 'category'>;
	};
	cooldown?: {
		command?: number;
		cache?: number;
		collections?: Array<string>;
	};
}

export interface ModuleOptions {
	options: {
		message?: MessageHandlerOptions;
		slash?: SlashHandlerOptions;
		context?: ContextHandlerOptions;
		events?: EventHandlerOptions;
		inhibitors?: InhibitorHandlerOptions;
	};
	commandHandler: CommandHandler;
	eventHandler: EventHandler;
	inhibitorHandler: InhibitorHandler;
	webhookHandler: WebhookHandler;
	extensionHandler: ExtensionHandler;
}

export interface XernerxCommands {
	message: Collection<string, MessageCommandBuilder>;
	slash: Collection<string, XernerxSlashCommand>;
	context: Collection<string, XernerxContextCommand>;
}

export interface DBLOptions {
	topgg: {
		token: string;
	};
	dbl: {
		token: string;
	};
	config: {
		emits: boolean;
		logs: boolean;
	};
}

export interface XernerxCache {
	messages: Collection<string, string>;
	cooldowns: Collection<
		string,
		{
			id: string;
			command: string;
			createdTimestamp: number;
		}
	>;
}

interface CommandHandlerOptions {
	directory: string;
	cooldown?: number;
	permissions?: {
		user?: Array<PermissionNames> | Array<string> | null;
		client?: Array<PermissionNames> | Array<string> | null;
		dm?: boolean;
	};
}

export interface MessageHandlerOptions extends CommandHandlerOptions {
	prefix: string | Array<string>;
	allowMention?: boolean;
	handleEdits?: boolean;
	handleDeletes?: boolean;
	handleTyping?: boolean;
}
export interface SlashHandlerOptions extends CommandHandlerOptions {
	defer?: {
		reply?: boolean;
		ephemeral?: boolean;
		fetchReply?: boolean;
	};
}
export interface ContextHandlerOptions extends CommandHandlerOptions {
	defer?: {
		reply?: boolean;
		ephemeral?: boolean;
		fetchReply?: boolean;
	};
}

export interface EventHandlerOptions {
	directory: string;
}

export interface InhibitorHandlerOptions {
	directory: string;
}

interface CommandOptions {
	name: string;
	description?: string | null;
	usage?: string | null;
	info?: string | null;
	category?: string | null;
	cooldown?: number | null;
	global?: boolean;
	channel?: Array<keyof typeof ChannelType> | keyof typeof ChannelType | null;
	ignore?: {
		owner?: boolean;
		users?: Array<string>;
		channels?: Array<string>;
		guilds?: Array<string>;
		voice?: boolean;
	};
	strict?: {
		owner?: boolean;
		users?: Array<string>;
		channels?: Array<string>;
		guilds?: Array<string>;
		voice?: boolean;
	};
	permissions?: {
		user?: Array<PermissionNames> | Array<string> | null;
		client?: Array<PermissionNames> | Array<string> | null;
		dm?: boolean;
	};
}

export interface MessageCommandOptions extends CommandOptions {
	aliases?: Array<string>;
	separator?: string;
	prefix?: Array<string> | string;
	regex?: RegExp;
	channelType?: Array<ChannelType>;
	args?: Array<MessageCommandArgumentOptions>;
	flags?: Array<MessageCommandFlagOptions>;
}

export interface MessageCommandArgumentOptions {
	type: MessageCommandArgumentType;
	name: string;
	content?: Array<string>;
	match?: string | Array<string>;
	description?: string;
	default?: string | Function;
	separator?: string | RegExp;
	prompt?: {
		reply?: string;
		send?: string;
	};
}

export interface MessageCommandFlagOptions {
	name: string;
	match: string;
}

export interface MessageCommandArguments {
	args: Record<string, unknown> | null;
	flags: Record<string, boolean> | null;
}

export interface SlashCommandOptions extends CommandOptions {
	description: string;
	nameLocalizations?: Record<Locales, string | null> | null;
	descriptionLocalizations?: Record<Locales, string | null> | null;
	defer?: {
		reply?: boolean;
		ephemeral?: boolean;
		fetchReply?: boolean;
	};
	args?: Array<SlashCommandArgumentOptions>;
	subcommands?: Array<SlashCommandSubcommandOptions>;
	groups?: Array<SlashCommandGroupOptions>;
}
export interface ContextCommandOptions extends CommandOptions {
	type: 'user' | 'message';
	nameLocalizations?: Record<Locales, string | null> | null;
	defer?: {
		reply?: boolean;
		ephemeral?: boolean;
		fetchReply?: boolean;
	};
}

export interface SlashCommandArgumentOptions {
	type: SlashCommandArgumentType;
	name: string;
	description: string;
	required?: boolean;
	autocomplete?: boolean;
	choices?: Array<Record<string, string>>;
}

export interface SlashCommandSubcommandOptions {
	name: string;
	description: string;
	args?: Array<SlashCommandArgumentOptions>;
}

export interface SlashCommandGroupOptions {
	name: string;
	description: string;
	subcommands: Array<SlashCommandSubcommandOptions>;
}

export interface SlashCommandArguments<T = SlashCommandArgumentType> {
	args: Record<string, any>;
	subcommand: string;
	group: string;
}

export interface XernerxEventOptions {
	name: XernerxEventType;
	emitter?: 'client' | 'process';
	type?: 'discord' | 'node';
	once?: boolean;
}

export interface XernerxInhibitorOptions {
	name: string;
	type: InhibitorType;
}

export interface PresenceOptions {
	text: string;
	type?: ActivityType.Playing | ActivityType.Streaming | ActivityType.Listening | ActivityType.Watching | ActivityType.Competing;
	url: string;
	status?: PresenceStatusData;
	interval?: number;
}

export type ContextCommandArguments<T extends 'user' | 'message'> = T extends 'user' ? XernerxUser : XernerxMessage;

export interface PaginatorOptions {
	type?: 'button' | 'select-menu' | 'combined';
	buttons?: Array<string>;
	description?: boolean;
	placeholder?: string;
	index?: number;
	send?: boolean;
	filter?: Function;
	time?: number;
}

export interface ResolveCommandOptions {
	type?: 'MessageCommand' | 'SlashCommand' | 'ContextCommand' | 'Interaction';
	name?: string;
}
