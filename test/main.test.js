/** @format */

import sharpyy from 'sharpyy';

import * as XMJS from './bot.test.mjs';
import * as XCJS from './bot.test.cjs';
import config from './config.js';

[
	[XMJS.XernerxClient, 'MJS'],
	// [XCJS.XernerxClient, 'CJS'],
].forEach(async ([Client, type]) => {
	const client = new (class TestClient extends Client {
		constructor() {
			super(
				{
					intents: [1],
				},
				{
					log: {
						type: 'dynamic',
						info: true,
					},
				},
				config
			);

			this.modules.commandHandler.loadSlashCommands({
				directory: './test/commands/slash',
				global: true,
			});
		}
	})();

	await new Promise((resolve) => setTimeout(resolve, 5000));
});
