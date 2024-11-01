/** @format */

import ora from 'ora';
import boxen from 'boxen';
import sharpyy from 'sharpyy';

export const XernerxLog = new (class XernerxLog {
	public readonly spinner;

	constructor() {
		this.spinner = ora();

		this.spinner.color = 'magenta';

		console.info(this.#box(sharpyy('XERNERX', 'txRainbow', 'bold'), { borderColor: 'magenta' }));

		this.#spin();
	}

	public info(message: string) {
		if (process.xernerx.log?.levels.info) this.spinner.info(`${this.#base()} ${message}`);

		this.#spin();

		return process.xernerx.log?.levels.info;
	}

	#spin() {
		if (process.xernerx?.log?.type !== 'dynamic') return;

		this.spinner.start();

		this.#status();
	}

	#status() {
		setInterval(() => {
			if (!process.XernerxClient?.user) return (this.spinner.text = `${this.#base()} Connecting to Discord...`);

			const client = process.XernerxClient;

			const data = {
				'Name': sharpyy(String(client.user?.tag), 'txBlue'),
				// 'Status': `${sharpyy('Online', 'txGreen')} | ${client.settings.global ? sharpyy('Global', 'txGreen') : sharpyy('Local', 'txRed')}`,
				// 'Uptime': client.util.uptime(client.uptime).split('').map((c) => (isNaN(Number(c)) ? c : sharpyy(c, 'txCyan'))).join(''),
				// 'Commands': client.settings.global ? `${counts.local ? `local: ${counts.local}` : ''}|${counts.global ? `global: ${counts.global}` : ''}` : counts.local + counts.global,
				'RAM Usage': this.#dynamic().ram,
				// 'Guilds': (await Promise.all(client.settings.guilds.map(async (id) => sharpyy((await client.guilds.fetch(id))?.name || id, 'txBlue')))).join(', '),
				// 'Owners': (await Promise.all(client.settings.owners.map(async (id) => sharpyy((await client.users.fetch(id))?.username || id, 'txBlue')))).join(', '),
				// 'GuildCount': sharpyy(String(client.stats.guilds), 'txCyan'),
				// 'UserCount': sharpyy(String(client.stats.users), 'txCyan'),
				// 'ShardCount': sharpyy(String(client.stats.shardCount), 'txCyan'),
			};

			this.spinner.text = boxen(
				Object.entries(data)
					.map(([key, value]) => `${key}: ${value}`)
					.join('\n'),
				{
					padding: 1,
					margin: 1,
					borderStyle: 'round',
					borderColor: 'magenta',
					title: this.#dynamic().time + ' - ' + sharpyy('XERNERX', 'txRainbow', 'bold') + '\x1B[35m',
					fullscreen: (width, height) => [width - 5, Object.keys(data).length * 3],
				}
			);
		}, 250);
	}

	#box(text: string, config: any) {
		return boxen(text, {
			padding: 1,
			margin: 1,
			borderStyle: 'round',
			height: 3,
			align: 'center',
			fullscreen: (width, height) => [width - 3, height],
			...config,
		});
	}

	#dynamic() {
		const time = new Date()
			.toLocaleTimeString()
			.split(/ /gim)
			.map((str) =>
				str
					.split(':')
					.map((str) => (isNaN(Number(str)) ? str : sharpyy(str, 'txCyan')))
					.join(':')
			)
			.join(' ');

		const ram = `${sharpyy(String(Math.round(process.memoryUsage().rss / 10000) / 100), 'txCyan')}mb`;

		return { time, ram };
	}

	#base() {
		return `${sharpyy('XERNERX', 'txRainbow', 'bold')} | ${this.#dynamic().time} | ${this.#dynamic().ram} |`;
	}
})();
