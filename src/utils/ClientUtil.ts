/** @format */

import setPresence from '../functions/setPresence.js';
import XernerxClient from '../client/XernerxClient.js';
import { PresenceOptions, ResolveCommandOptions } from '../types/interfaces.js';
import Util from './Util.js';
import { Collection } from 'discord.js';
import { XernerxContextCommand, XernerxMessageCommand, XernerxSlashCommand } from '../main.js';

export default class ClientUtil extends Util {
	public declare hasVoted: Function;

	constructor(client: XernerxClient) {
		super(client);
	}

	public setPresence(options: PresenceOptions) {
		return setPresence(this.client, options);
	}

	// @ts-ignore
	private resolveCooldown() {}

	public resolveCommand(options: ResolveCommandOptions) {
		const commands = [],
			collection = new Collection();

		if (options?.type == 'MessageCommand' || !options?.type) commands.push(...this.client.commands.message);

		if (options?.type == 'Interaction' || options?.type == 'SlashCommand' || !options?.type) commands.push(...this.client.commands.slash);

		if (options?.type == 'Interaction' || options?.type == 'ContextCommand' || !options?.type) commands.push(...this.client.commands.context);

		commands.map(([name, command]) => collection.set(name, command));

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
}
