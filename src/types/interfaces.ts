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
