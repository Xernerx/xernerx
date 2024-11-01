/** @format */

import { XernerxClient } from '../client/XernerxClient.js';
import { XernerxLog } from '../tools/XernerxLog.js';

process.xernerx = {};

export function init(client: XernerxClient) {
	process.xernerx.log = client.settings.log;

	if (client.settings.debug) {
		XernerxLog.info('Debug mode enabled, logging all handlings...');
	}

	client.once('ready', (client) => {
		process.XernerxClient = client as XernerxClient;
	});
}
