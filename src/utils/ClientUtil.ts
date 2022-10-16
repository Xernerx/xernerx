import {
	ActivityOptions,
	ActivityType,
	ClientPresenceStatus,
} from "discord.js";
import XernerxClient from "../client/XernerxClient.js";

interface Presence {
	text?: string;
	type?: any;
	link?: string;
	status?: ClientPresenceStatus;
	interval?: number;
}

export class ClientUtil {
	client: XernerxClient;

	constructor(client: XernerxClient) {
		this.client = client;
	}

	isOwner(userId: string) {
		if (!userId) throw new Error("No ID specified");

		let owners = this.client.settings.ownerId;

		if (!owners) return false;

		if (typeof owners === "string") owners = [owners];

		return owners.includes(userId);
	}

	getAllCommands() {
		const cmds: object[] = [];

		for (const commands of Object.values(this.client.commands)) {
			commands.map((cmd: object) => cmds.push(cmd));
		}

		return cmds;
	}

	getAllMessageCommands() {
		const cmds: object[] = [];

		this.client.commands.message.map((cmd: object) => cmds.push(cmd));

		return cmds;
	}

	getAllSlashCommands() {
		const cmds: object[] = [];

		this.client.commands.slash.map((cmd: object) => cmds.push(cmd));

		return cmds;
	}

	getAllContextCommands() {
		const cmds: object[] = [];

		this.client.commands.context.map((cmd: object) => cmds.push(cmd));

		return cmds;
	}

	setPresence(options: Presence) {
		const client = this.client;
		function pres() {
			client.user?.setPresence({
				activities: [
					{
						name: options.text || undefined,
						type: options.type || undefined,
						url: options.link || undefined,
					},
				],
				status: options.status || undefined,
			});
		}

		pres();
		if (options.interval) {
			setInterval(() => {
				pres();
			}, options.interval);
		}
	}

	getCooldownTimers(id: string, command?: string) {
		let cooldowns: any = [];

		for (const [key, value] of Object.entries(this.client.cache)) {
			if (
				![
					"cooldowns",
					"messageCommands",
					"slashCommands",
					"contextCommands",
					"commands",
				].includes(key)
			)
				continue;

			if (key === "commands") {
				if (command) {
					value.map((x: any) => {
						const name = x.name.split(/-/);
						name.pop();
						if (name.join("-") === id + "-" + command) {
							cooldowns.push({ [x.commandName]: x.endsAt - Date.now() });
						}
					});
				} else {
					value.map((x: any) => {
						if (x.name.split(/-/).shift() === id) {
							cooldowns.push({ [x.commandName]: x.endsAt - Date.now() });
						}
					});
				}
			} else {
				if (value.has(id)) {
					const x = value.get(id);

					cooldowns.push({ [key]: x.endsAt - Date.now() });
				}
			}
		}

		const sort = cooldowns
			.map((x: any) => Object.entries(x).shift())
			.sort((a: any, b: any) => b[1] - a[1]);

		cooldowns = [];

		sort.map(([key, value]: any) => cooldowns.push({ [key]: value }));

		return cooldowns;
	}
}
