/** @format */

/**
 * @fileoverview A TypeScript file for logging messages with customizable settings and dynamic information.
 * @author Dummi
 */

/**
 * @typedef {import('ora').Color} Color
 * @typedef {import('ora').Spinners} Spinners
 */
import ora, { Color, spinners } from 'ora';
import boxen from 'boxen';
import sharpyy from 'sharpyy';

let index = 0;
let init = false;

const records = {
	info: 0,
	warn: 0,
	error: 0,
};

/**
 * A class for logging messages with customizable settings and dynamic information.
 * @class XernerxLog
 */
export const XernerxLog = new (class XernerxLog {
	/**
	 * The spinner instance for displaying log messages.
	 * @type {ora.Ora}
	 */
	public readonly spinner;

	/**
	 * Initializes the XernerxLog class with a customizable spinner and logs a boxed title.
	 */
	constructor() {
		this.spinner = ora();

		this.spinner.color = 'magenta';

		this.spinner.spinner = spinners.aesthetic;

		console.info(this.#box(sharpyy('XERNERX', 'txRainbow', 'bold'), { borderColor: 'magenta' }));

		this.#spin();

		this.#static();
	}

	/**
	 * Logs an informational message to the console.
	 * @param {string} message - The message to be logged.
	 * @param {boolean} [force=false] - A flag indicating whether the message should be logged regardless of the log level settings.
	 * @returns {boolean} - True if the message was logged, false otherwise.
	 */
	public info(message: string, force: boolean = false) {
		if (process.xernerx?.log?.levels?.info || force) this.spinner.info(` ${this.#base()} ${message}`);

		this.#spin();

		records.info++;

		return process.xernerx?.log?.levels?.info || force;
	}

	public warn(message: string, force: boolean = false) {
		if (process.xernerx?.log?.levels?.warn || force) this.spinner.warn(` ${this.#base()} ${message}`);

		this.#spin();

		records.warn++;

		return process.xernerx?.log?.levels?.warn || force;
	}

	/**
	 * Logs a debug message to the console.
	 * @param {string} message - The message to be logged.
	 * @param {boolean} [force=false] - A flag indicating whether the message should be logged regardless of the log level settings.
	 * @returns {boolean} - True if the message was logged, false otherwise.
	 */
	public debug(message: string, force: boolean = false) {
		if ((process.XernerxClient?.settings?.debug && process.xernerx?.log?.levels?.debug) || force) this.spinner.stopAndPersist({ symbol: sharpyy('𖠊', 'txGreen'), text: `${this.#base()} ${message}` });

		this.#spin();

		return (process.XernerxClient?.settings?.debug && process.xernerx?.log?.levels?.debug) || force;
	}

	#spin() {
		if (process.xernerx?.log?.type !== 'dynamic') return;

		this.spinner.start();

		this.#status();
	}

	#static() {
		if (process.xernerx?.log?.type !== 'static') return;

		this.info('Connecting to Discord...', true);
	}

	#status() {
		setInterval(async () => {
			if (!process.XernerxClient?.user) return (this.spinner.text = `${this.#base()} Connecting to Discord...`);

			if (!init) this.spinner.spinner = spinners.dots12;

			this.spinner.color = this.#debug() ? 'green' : this.#rainbow();

			const client = process.XernerxClient;

			const data = {
				'Name': sharpyy(String(client.user?.tag), 'txBlue'),
				'Status': `${this.#presence()} | ${client.settings.global ? sharpyy('Global', 'txGreen') : sharpyy('Local', 'txRed')}`,
				'Uptime': client.util.uptime(client.uptime),
				// 'Commands': client.settings.global ? `${counts.local ? `local: ${counts.local}` : ''}|${counts.global ? `global: ${counts.global}` : ''}` : counts.local + counts.global,
				'Latency': `${sharpyy(String(client.ws.ping), 'txCyan')}ms`,
				'RAM Usage': `${this.#dynamic().ram}`,
				'Guilds': (await Promise.all(client.settings.guilds.map(async (id) => sharpyy((await client.guilds.fetch(id))?.name || id, 'txBlue')))).join(', '),
				'Owners': (await Promise.all(client.settings.owners.map(async (id) => sharpyy((await client.users.fetch(id))?.username || id, 'txBlue')))).join(', '),
				// 'GuildCount': sharpyy(String(client.stats.guilds), 'txCyan'),
				// 'UserCount': sharpyy(String(client.stats.users), 'txCyan'),
				// 'ShardCount': sharpyy(String(client.stats.shardCount), 'txCyan'),
				'Logs': `${sharpyy(String(records.info), 'txBlue')} | ${sharpyy(String(records.warn), 'txYellow')} | ${sharpyy(String(records.error), 'txRed')}`,
				'Intents': `${client.options.intents.toArray().join(', ')}`,
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
					title: `${sharpyy('XERNERX', 'txRainbow', 'bold')} ${sharpyy(' - ', 'txMagenta')} ${this.#dynamic().time} ${this.#debug() ? sharpyy(' - ', 'txMagenta') + sharpyy('DEBUG MODE', 'txGreen', 'bold') : ''}\x1B[35m`,
					fullscreen: (width) => [width - 3, Object.keys(data).length * 1.75],
				}
			);

			init = true;
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
		return `| ${sharpyy('XERNERX', 'txRainbow', 'bold')} | ${this.#dynamic().time} | ${this.#dynamic().ram} |`;
	}

	#debug() {
		return process.XernerxClient?.settings?.debug;
	}

	#presence() {
		const user = process.XernerxClient.user;

		switch (user?.presence.status) {
			case 'dnd':
				return sharpyy(user.presence.status, 'txRed');
			case 'online':
				return sharpyy(user.presence.status, 'txGreen');
			case 'idle':
				return sharpyy(user.presence.status, 'txYellow');
			case 'offline':
				return sharpyy(user.presence.status, 'txGray');
			case 'invisible':
				return sharpyy(user.presence.status, 'txGray');
		}
	}

	#rainbow() {
		const colors = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta'];

		const color = colors[index];

		if (index === colors.length - 1) index = 0;
		else index++;

		return color as Color;
	}
})();
