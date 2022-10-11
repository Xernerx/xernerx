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
}
