/** @format */

import sharpyy from 'sharpyy';
import { Color } from 'ora';

import { XernerxClient } from '../client/XernerxClient.js';
import XernerxLog from '../tools/XernerxLog.js';

let init = false;

export async function start(client: XernerxClient) {
	if (init) return;

	if (client.settings.debug) XernerxLog.info('Debug mode enabled, preventing console clear and logging all handlings...');
	else console.clear();

	const { default: ora, spinners } = await import('ora');
	const { default: boxen } = await import('boxen');

	console.info(
		boxen(sharpyy('XERNERX', 'txRainbow', 'bold', 'underlines'), {
			padding: 1,
			margin: 1,
			borderStyle: 'round',
			height: 3,
			align: 'center',
			borderColor: 'magenta',
			fullscreen: (width, height) => [width - 5, height],
		})
	);

	if (!client.options.intents.has('Guilds'))
		XernerxLog.warn('Your bot is signed in without the Guilds intent, this may cause issues with the bot.', new URL('https://discord.com/developers/docs/topics/gateway#gateway-intents'));

	const spinner = ora();

	spinner.spinner = spinners.dots12;

	spinner.start();

	let index = 0;

	setInterval(async () => {
		// Update Discord stats
		calculateStats(client);

		// Update commandline

		const time = new Date()
				.toLocaleTimeString()
				.split(/ /gim)
				.map((str) =>
					str
						.split(':')
						.map((str) => (isNaN(Number(str)) ? str : sharpyy(str, 'txCyan')))
						.join(':')
				)
				.join(' '),
			ram = `${sharpyy(String(Math.round(process.memoryUsage().rss / 10000) / 100), 'txCyan')}mb`;

		const colors = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan'];

		const baseText = `${sharpyy('XERNERX', 'txRainbow', 'bold')} | ${time} | ${ram} | `;

		if (client.user) {
			spinner.color = colors[index] as Color;

			const counts = {
				local: client.commands.stats.slash.local + client.commands.stats.message.local + client.commands.stats.context.local,
				global: client.commands.stats.slash.global + client.commands.stats.message.global + client.commands.stats.context.global,
			};

			spinner.text = boxen(
				Object.entries({
					'Name': sharpyy(client.user.tag, 'txBlue'),
					'Status': `${sharpyy('Online', 'txGreen')} | ${client.settings.global ? sharpyy('Global', 'txGreen') : sharpyy('Local', 'txRed')}`,
					'Uptime': client.util
						.uptime(client.uptime)
						.split('')
						.map((c) => (isNaN(Number(c)) ? c : sharpyy(c, 'txCyan')))
						.join(''),
					'Commands': client.settings.global ? `${counts.local ? `local: ${counts.local}` : ''}|${counts.global ? `global: ${counts.global}` : ''}` : counts.local + counts.global,
					'RAM Usage': ram,
					'Guilds': (await Promise.all(client.settings.guilds.map(async (id) => sharpyy((await client.guilds.fetch(id))?.name || id, 'txBlue')))).join(', '),
					'Owners': (await Promise.all(client.settings.owners.map(async (id) => sharpyy((await client.users.fetch(id))?.username || id, 'txBlue')))).join(', '),
					'GuildCount': sharpyy(String(client.stats.guilds), 'txCyan'),
					'UserCount': sharpyy(String(client.stats.users), 'txCyan'),
					'ShardCount': sharpyy(String(client.stats.shardCount), 'txCyan'),
				})
					.map(([key, value]) => `${key}: ${value}`)
					.join('\n'),
				{
					padding: 1,
					margin: 1,
					borderStyle: 'round',
					borderColor: 'magenta',
					title: time + ' - ' + sharpyy('XERNERX', 'txRainbow', 'bold') + '\x1B[35m',
					height: 15,
					fullscreen: (width, height) => [width - 5, height],
				}
			);
		} else {
			spinner.color = 'green';

			spinner.text = baseText + `Connecting to Discord${index == 0 ? '.' : index == 1 ? '..' : index == 2 ? '...' : ''}`;
		}

		index++;

		if (index == colors.length - 1) index = 0;
	}, 250);

	init = true;
}

function calculateStats(client: XernerxClient) {
	client.stats.guilds = client.guilds.cache.size;
	client.stats.users = client.users.cache.size;
	client.stats.shardCount = client.options.shardCount || null;
}
