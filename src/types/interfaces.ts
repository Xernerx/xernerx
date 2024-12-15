/** @format */

import { Events, RESTEvents } from 'discord.js';

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
		type?: 'static' | 'dynamic';
		levels?: {
			error?: boolean;
			warn?: boolean;
			info?: boolean;
			debug?: boolean;
		};
	};
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
	aliases?: Array<string>;
	strict: {
		guilds?: Array<string>;
		channels?: Array<string>;
		users?: Array<string>;
		roles?: Array<string>;
	};
}

export interface XernerxMessageCommandHandlerOptions extends XernerxBaseHandlerOptions {}
