/** @format */

import { Events, RESTEvents, SKU, User } from 'discord.js';
import { EventHandler } from '../handler/EventHandler.js';
import { CommandHandler } from '../handler/CommandHandler.js';
import DashboardHandler from '../handler/DashboardHandler.js';

export interface XernerxOptions {
	// Required
	token?: string;
	global?: boolean;
	guilds?: Array<string>;

	// Optional
	owners?: Array<string>;

	// Dev
	debug?: boolean;
	log?: {
		dashboard?: boolean;
		type?: 'static' | 'dynamic';
		levels?: {
			error?: boolean;
			warn?: boolean;
			info?: boolean;
			debug?: boolean;
		};
	};
}

export interface XernerxUser extends User {
	owner: boolean;
	premium: Array<SKU>;
}

export interface XernerxModules {
	options: {
		events?: Partial<XernerxEventHandlerOptions>;
		commands: {
			message?: Partial<XernerxMessageCommandHandlerOptions>;
			// context: XernerxCommandContextHandlerOptions;
			slash?: Partial<XernerxSlashCommandHandlerOptions>;
		};
	};
	eventHandler: EventHandler;
	commandHandler: CommandHandler;
	dashboardHandler: DashboardHandler;
}

export interface XernerxBaseHandlerOptions {
	directory: string;
	delay?: number;
}

export interface XernerxEventHandlerOptions extends XernerxBaseHandlerOptions {}

export interface XernerxBaseBuilderOptions {
	name: string;
	description: string;
}

export interface XernerxEventOptions extends XernerxBaseBuilderOptions {
	watch?: Events | RESTEvents;
	type: 'discord' | 'node' | string;
	emitter: 'client' | 'process' | 'rest';
	once: boolean;
}

export interface XernerxBaseCommandOptions extends XernerxBaseBuilderOptions {
	info?: string;
	category?: string;
	usage?: string;
	cooldown?: number;
	ignore?: {
		guilds?: Array<string>;
		channels?: Array<string>;
		users?: Array<string>;
		roles?: Array<string>;
		owner?: boolean;
	};
	strict?: {
		guilds?: Array<string>;
		channels?: Array<string>;
		users?: Array<string>;
		roles?: Array<string>;
		owner?: boolean;
	};
}

export interface XernerxMessageCommandHandlerOptions extends XernerxBaseHandlerOptions {
	prefix: string | Array<string>;
}

export interface XernerxMessageCommandBuilderOptions extends XernerxBaseCommandOptions {
	aliases?: Array<string>;
	prefix?: string | Array<string>;
}

export interface XernerxSlashCommandHandlerOptions extends XernerxBaseHandlerOptions {}

export interface XernerxSlashCommandBuilderOptions extends XernerxBaseCommandOptions {}
