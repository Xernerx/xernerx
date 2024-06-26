/** @format */

import { Collection } from 'discord.js';

import setPresence from '../functions/setPresence.js';
import XernerxClient from '../client/XernerxClient.js';
import { PresenceOptions, ResolveCommandOptions } from '../types/interfaces.js';
import Util from './Util.js';
import XernerxContextCommand from '../build/XernerxContextCommand.js';
import XernerxMessageCommand from '../build/XernerxMessageCommand.js';
import XernerxSlashCommand from '../build/XernerxSlashCommand.js';

export default class ClientUtil extends Util {
	public declare hasVoted: Function;

	constructor(client: XernerxClient) {
		super(client);

		this.setPresence = this.setPresence;

		this.resolveCooldown = this.resolveCooldown;

		this.resolveChannel = this.resolveChannel;

		this.commands = this.commands;

		this.resolveGuild = this.resolveGuild;

		this.uptime = this.uptime;
	}

	public setPresence(options: PresenceOptions) {
		return setPresence(this.client, options);
	}

	// @ts-ignore
	private resolveCooldown() {}

	public async resolveCommand(options: ResolveCommandOptions) {
		const interCommands = await this.client.application?.commands.fetch();

		const commands = [],
			collection = new Collection();

		if (options?.type == 'MessageCommand' || !options?.type) commands.push(...this.client.commands.message);

		if (options?.type == 'Interaction' || options?.type == 'SlashCommand' || !options?.type) commands.push(...this.client.commands.slash);

		if (options?.type == 'Interaction' || options?.type == 'ContextCommand' || !options?.type) commands.push(...this.client.commands.context);

		commands.map(([name, command]) => {
			command.snowflake = interCommands?.find((cmd) => command.name === cmd.name)?.id || null;

			collection.set(name, command);
		});

		if (options?.name) {
			return (collection.get(options.name) as XernerxMessageCommand | XernerxSlashCommand | XernerxContextCommand) || null;
		} else return collection as Collection<string, XernerxMessageCommand | XernerxSlashCommand | XernerxContextCommand>;
	}

	public async resolveChannel(query: string | Record<string, string>) {
		if (typeof query == 'object') query = query.id;

		try {
			let channel =
				this.client.channels.cache.find(<T>(channel: T) =>
					(channel as Record<string, string>).name == (query as string).toLowerCase() || (channel as Record<string, string>).id == (query as string).toLowerCase() ? channel : null
				) || null;

			if (!channel) channel = (await this.client.channels.fetch(query)) || null;

			return channel;
		} catch {
			return null;
		}
	}

	public async resolveGuild(query: string | Record<string, string>) {
		if (typeof query == 'object') query = query.id;

		try {
			let guild = this.client.guilds.cache.find((guild) => guild.name.toLowerCase() == (query as string).toLowerCase()) || null;

			if (!guild) guild = (await this.client.guilds.fetch(query)) || null;

			return guild;
		} catch {
			return null;
		}
	}

	public uptime(timestamp?: number | null) {
		if (!timestamp) timestamp = this.client.uptime || 0;
		let totalSeconds = timestamp / 1000;
		let years = Math.floor(totalSeconds / 31536000);
		totalSeconds %= 31536000;
		let days = Math.floor(totalSeconds / 86400);
		totalSeconds %= 86400;
		let hours = Math.floor(totalSeconds / 3600);
		totalSeconds %= 3600;
		let minutes = Math.floor(totalSeconds / 60);
		let seconds = Math.floor(totalSeconds % 60);

		if (years >= 1) return `${years}y ${days}d ${hours}h ${minutes}m`;
		else if (days >= 1) return `${days}d ${hours}h ${minutes}m`;
		else if (hours >= 1) return `${hours}h ${minutes}m`;
		else if (minutes >= 1) return `${minutes}m ${seconds}s`;
		else return `${seconds}s`;
	}

	public commands() {
		return [...this.client.commands.context.toJSON(), ...this.client.commands.slash.toJSON(), ...this.client.commands.message.toJSON()];
	}

	public commandsList() {
		function set(name: string, type: 'MessageCommand' | 'SlashCommand' | 'ContextCommand', description?: string | null, usage?: string | null) {
			return collection.set(name, { name, type, description, usage });
		}

		const commands = this.commands();

		const collection = new Collection<string, object>();

		commands.map((command) => {
			if (command.filetype == 'MessageCommand' || command.filetype == 'ContextCommand') return set(command.name, command.filetype, command.description, command.usage);
			else if (command.data.options.length) {
				command.data.options.map((option: any) => {
					if (!option.type) {
						if (option.options.length) {
							option.options.map((o: any) => {
								if (!o.type) set(`${command.name} ${option.name} ${o.name}`, command.filetype, o.description, command.usage);
								else set(`${command.name} ${option.name}`, command.filetype, option.description, command.usage);
							});
						} else {
							set(`${command.name} ${option.name}`, command.filetype, option.description, command.usage);
						}
					}
				});
			} else {
				set(command.name, command.filetype, command.description, command.usage);
			}
		});

		return collection;
	}
}
