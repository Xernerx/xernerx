/** @format */
import { Style } from 'dumfunctions';
import * as fs from 'fs';
import Discord from 'discord.js';
import { version } from '../main.js';
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
let i = 0;
export default class XernerxLog {
	constructor(client) {
		this.client = client;
		if (client == true || (typeof client.settings.log == 'boolean' && client.settings.log)) {
			this.errorLog = true;
			this.infoLog = true;
			this.warnLog = true;
			this.format = ['ram', 'time'];
		} else {
			this.errorLog = client.settings.log?.error;
			this.infoLog = client.settings.log?.info;
			this.warnLog = client.settings.log?.warn;
			this.readyLog = client.settings.log?.ready;
			this.tableLog = client.settings.log?.table;
			this.format = client.settings.log?.format || ['ram', 'time'];
		}
		const format = {
			name: this.blue(pkg.name),
			node: this.green(process.version),
			xernerx: this.cyan(version),
			discordjs: this.cyan(Discord.version),
			platform: this.green(process.platform),
			time: () => this.cyan(new Date().toLocaleTimeString()),
			date: () => this.cyan(new Date().toLocaleDateString()),
			ram: () => `${this.cyan(Math.round(process.memoryUsage().rss / 1000000))}mb`,
			version: this.cyan(pkg.version),
			author: this.blue(pkg.author),
			shard: this.cyan(''),
			index: () => {
				i++;
				return i;
			},
		};
		process.on('message', (message) => {
			if (message.type == 'xernerx') format.shard = message?.data?.sharded ? `| ${message?.data?.shardId} |` : '';
		});
		this.base = (type, message) =>
			`${
				type == 'info'
					? `✔️  | ${this.purple('Xernerx')}`
					: type == `error`
					? `❗ | ${this.red('Xernerx')}`
					: type == `update`
					? `⬆️  | ${this.blue('Xernerx')}`
					: type == `debug`
					? `🐛 | ${this.turquoise('Xernerx')}`
					: `⚠️  | ${this.yellow('Xernerx')}`
			} | ${this.format
				?.map((c) => (typeof format[c] == 'function' ? format[c]() : format[c]) || null)
				.filter((x) => x)
				.join(' | ')} | ${message}`;
	}
	info(message, force = false) {
		return this.infoLog || force ? console.info(this.base('info', message)) : null;
	}
	warn(message) {
		return this.warnLog ? console.warn(this.base('warn', message)) : null;
	}
	debug(message) {
		return console.debug(this.base('debug', message));
	}
	async update(version, url) {
		try {
			const pkg = await fetch(url)
				.then(async (res) => await res.json())
				.catch(() => ({ version }));
			if (version !== pkg.version)
				console.info(
					this.base(
						'update',
						`A new version for ${pkg.name} is available, you're using version ${this.cyan(version)}, new version is ${this.cyan(pkg.version)}, run ${Style.log(`npm i ${pkg.name}@${pkg.version}`, {
							color: Style.BackgroundColor.Grey,
						})} to update to the latest version.`
					)
				);
		} catch (error) {
			console.warn(this.base('error', `An error occured while trying to check for a new version for ${pkg.name}, please try again later.`));
		}
	}
	error(message, error) {
		return this.errorLog ? console.error(this.base('error', message), error || '') : null;
	}
	ready() {
		if (typeof this.client == 'boolean') return;
		const client = this.client;
		// @ts-ignore
		this.client.prependOnceListener('ready', async (synced) => {
			this.info(
				`${Style.log(synced.user.tag, { color: Style.TextColor.Blue })} is now ${this.green('online')}, watching ${this.cyan(String(client.guilds.cache.size))} guild${
					client.guilds.cache.size > 1 ? 's' : ''
				}, using ${client.settings.local ? this.blue((await client.guilds.fetch(client.settings.local))?.name) : 'none'} as local guild.`,
				this.readyLog
			);
			const files = [];
			for (const [id, data] of client.commands.message) {
				files.push(data);
				id;
			}
			for (const [id, data] of client.commands.slash) {
				files.push(data);
				id;
			}
			for (const [id, data] of client.commands.context) {
				files.push(data);
				id;
			}
			for (const [id, data] of client.events) {
				files.push(data);
				id;
			}
			for (const [id, data] of client.inhibitors) {
				files.push(data);
				id;
			}
			if (this.tableLog) {
				console.table(files, this.tableLog);
			}
		});
	}
	cyan(string) {
		return Style.log(String(string), { color: Style.TextColor.Cyan });
	}
	blue(string) {
		return Style.log(String(string), { color: Style.TextColor.Blue });
	}
	yellow(string) {
		return Style.log(String(string), { color: Style.TextColor.Yellow });
	}
	purple(string) {
		return Style.log(String(string), { color: Style.TextColor.Purple });
	}
	red(string) {
		return Style.log(String(string), { color: Style.TextColor.Red });
	}
	green(string) {
		return Style.log(String(string), { color: Style.TextColor.Green });
	}
	turquoise(string) {
		return Style.log(String(string), { color: Style.TextColor.Turquoise });
	}
}
