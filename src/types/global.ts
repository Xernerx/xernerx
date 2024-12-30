/** @format */

import { XernerxClient } from '../main.js';

declare global {
	namespace NodeJS {
		interface Process {
			XernerxClient: XernerxClient;
			xernerx: {
				token?: string | null;
				log?: {
					type: 'static' | 'dynamic';
					levels: { info: boolean; error: boolean; warn: boolean; debug: boolean };
				};
			};
		}
	}
}
