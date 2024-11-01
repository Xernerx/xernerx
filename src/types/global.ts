/** @format */

import { XernerxClient } from '../main.js';

declare global {
	namespace NodeJS {
		interface Process {
			XernerxClient: XernerxClient;
			xernerx: {
				log?: {
					type: 'static' | 'dynamic';
					levels: { info: boolean; error: boolean; warn: boolean; debug: boolean };
					// format: Array<'name' | 'time' | 'ram'>;
				};
			};
		}
	}
}
