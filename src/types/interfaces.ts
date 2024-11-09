/** @format */

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

export interface XernerxEventHandlerOptions {
	directory: string;
	delay?: number;
}

export interface XernerxBaseBuilderOptions {
	name: string;
	description: string;
}

export interface XernerxEventOptions extends XernerxBaseBuilderOptions {
	name: string;
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
