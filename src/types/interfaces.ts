/** @format */

export interface XernerxOptions {
	token?: string;
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
