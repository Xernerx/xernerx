/** @format */
import { Collection } from 'discord.js';
import setPresence from '../functions/setPresence.js';
import Util from './Util.js';
export default class ClientUtil extends Util {
	constructor(client) {
		super(client);
		this.setPresence = this.setPresence;
		this.resolveCooldown = this.resolveCooldown;
		this.resolveChannel = this.resolveChannel;
		this.commands = this.commands;
		this.resolveGuild = this.resolveGuild;
		this.uptime = this.uptime;
	}
	setPresence(options) {
		return setPresence(this.client, options);
	}
	// @ts-ignore
	resolveCooldown() {}
	async resolveCommand(options) {
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
			return collection.get(options.name) || null;
		} else return collection;
	}
	async resolveChannel(query) {
		if (typeof query == 'object') query = query.id;
		try {
			let channel = this.client.channels.cache.find((channel) => (channel.name == query.toLowerCase() || channel.id == query.toLowerCase() ? channel : null)) || null;
			if (!channel) channel = (await this.client.channels.fetch(query)) || null;
			return channel;
		} catch {
			return null;
		}
	}
	async resolveGuild(query) {
		if (typeof query == 'object') query = query.id;
		try {
			let guild = this.client.guilds.cache.find((guild) => guild.name.toLowerCase() == query.toLowerCase()) || null;
			if (!guild) guild = (await this.client.guilds.fetch(query)) || null;
			return guild;
		} catch {
			return null;
		}
	}
	uptime(timestamp) {
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
	commands() {
		return [...this.client.commands.context.toJSON(), ...this.client.commands.slash.toJSON(), ...this.client.commands.message.toJSON()];
	}
	commandsList() {
		function set(name, type, description, usage) {
			return collection.set(name, { name, type, description, usage });
		}
		const commands = this.commands();
		const collection = new Collection();
		commands.map((command) => {
			if (command.filetype == 'MessageCommand' || command.filetype == 'ContextCommand') return set(command.name, command.filetype, command.description, command.usage);
			else if (command.data.options.length) {
				command.data.options.map((option) => {
					if (!option.type) {
						if (option.options.length) {
							option.options.map((o) => {
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
