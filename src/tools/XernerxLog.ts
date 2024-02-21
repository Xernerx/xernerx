/** @format */

import { Style } from 'dumfunctions';
import * as fs from 'fs';
import Discord from 'discord.js';

import XernerxError from './XernerxError.js';
import XernerxClient from '../client/XernerxClient.js';
import { XernerxClientType } from '../types/extenders.js';
import { version } from '../main.js';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

let i = 0;

export default class XernerxLog {
	private declare readonly client;
	private declare readonly errorLog;
	private declare readonly infoLog;
	private declare readonly warnLog;
	private declare readonly readyLog;
	private declare readonly tableLog;
	private declare readonly format;
	private declare readonly time;
	private declare readonly ram;
	private declare shard;
	private declare readonly base;

	constructor(client: XernerxClient | XernerxClientType | true) {
		this.client = client;

		if (client == true || (typeof client.settings.log == 'boolean' && client.settings.log)) {
			this.errorLog = true;

			this.infoLog = true;

			this.warnLog = true;

			this.format = ['ram', 'time'];
		} else {
			this.errorLog = (client.settings.log as unknown as Record<string, boolean>)?.error;

			this.infoLog = (client.settings.log as unknown as Record<string, boolean>)?.info;

			this.warnLog = (client.settings.log as unknown as Record<string, boolean>)?.warn;

			this.readyLog = (client.settings.log as unknown as Record<string, boolean>)?.ready;

			this.tableLog = (client.settings.log as unknown as Record<string, Array<string>>)?.table;

			this.format = (client.settings.log as unknown as Record<string, Array<string> | null>)?.format || ['ram', 'time'];
		}

		const format: Record<string, string | Function> = {
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
			if ((message as any).type == 'xernerx') format.shard = (message as any)?.data?.sharded ? `| ${(message as any)?.data?.shardId} |` : '';
		});

		this.base = (type: 'info' | 'update' | 'error' | 'warn', message: string) =>
			`${
				type == 'info' ? `✔️  | ${this.purple('Xernerx')}` : type == `error` ? `❗ | ${this.red('Xernerx')}` : type == `update` ? `⬆️  | ${this.blue('Xernerx')}` : `⚠️  | ${this.yellow('Xernerx')}`
			} | ${this.format
				?.map((c) => (typeof format[c] == 'function' ? (format[c] as Function)() : format[c]) || null)
				.filter((x) => x)
				.join(' | ')} | ${message}`;
	}

	public info(message: string, force: boolean = false) {
		return this.infoLog || force ? console.info(this.base('info', message)) : null;
	}

	public warn(message: string) {
		return this.warnLog ? console.warn(this.base('warn', message)) : null;
	}

	public async update(version: string, url: string) {
		const pkg: any = await fetch(url)
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
	}

	public error(message: string, error?: XernerxError | unknown) {
		return this.errorLog ? console.error(this.base('error', message), error) : null;
	}

	public ready() {
		if (typeof this.client == 'boolean') return;

		const client = this.client as XernerxClient;

		this.client.prependOnceListener('ready', async (synced) => {
			this.info(
				`${Style.log(synced.user.tag, { color: Style.TextColor.Blue })} is now ${this.green('online')}, watching ${this.cyan(String(client.guilds.cache.size))} guild${
					client.guilds.cache.size > 1 ? 's' : ''
				}, using ${client.settings.local ? this.blue((await client.guilds.fetch(client.settings.local))?.name) : 'none'} as local guild.`,
				this.readyLog
			);

			const files: Array<object> = [];

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

	private cyan(string: string | number) {
		return Style.log(String(string), { color: Style.TextColor.Cyan });
	}

	private blue(string: string | number) {
		return Style.log(String(string), { color: Style.TextColor.Blue });
	}

	private yellow(string: string | number) {
		return Style.log(String(string), { color: Style.TextColor.Yellow });
	}

	private purple(string: string | number) {
		return Style.log(String(string), { color: Style.TextColor.Purple });
	}

	private red(string: string | number) {
		return Style.log(String(string), { color: Style.TextColor.Red });
	}

	private green(string: string | number) {
		return Style.log(String(string), { color: Style.TextColor.Green });
	}
}
