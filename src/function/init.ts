/** @format */

import sharpyy from 'sharpyy';
import { XernerxClient } from '../client/XernerxClient.js';
import { XernerxLog } from '../tools/XernerxLog.js';

export function init(client: XernerxClient) {
	XernerxLog.debug('Initialising XernerxClient', client.settings.log.levels.debug && client.settings.debug);

	if (client.settings.debug)
		XernerxLog.info(`Running in debug mode. ${client.settings.log.levels.debug ? 'Logging all actions' : 'Debug logs are disabled. Set the debug log level to true to enable debug logs.'}`);

	if (client.settings.debug && client.settings.global)
		XernerxLog.warn(sharpyy(`Running debug mode globally is not advised, consider disabling global command deployment.`, 'bgYellow'), client.settings.log.levels.warn);

	XernerxLog.debug('Creating xernerx property on process', client.settings.log.levels.debug && client.settings.debug);
	process.xernerx = {};

	XernerxLog.debug('Adding log to xernerx process', client.settings.log.levels.debug && client.settings.debug);
	process.xernerx.log = client.settings.log;

	XernerxLog.info(
		`Logging mode: ${client.settings.log.type} | Levels: ${
			Object.entries(client.settings.log.levels)
				.map(([level, value]) => value && level)
				.filter((x) => x)
				.map((level) => sharpyy(String(level), 'txYellow'))
				.join(', ') || 'none'
		}`
	);

	client.once('ready', (client) => {
		XernerxLog.debug(`${client.user.tag} connected to Discord.`, (client as XernerxClient).settings.log.levels.debug && (client as XernerxClient).settings.debug);

		XernerxLog.debug('Adding XernerxClient to process');
		process.XernerxClient = client as XernerxClient;
	});
}
