/** @format */

import { Client, GatewayVersion, REST, Routes } from 'discord.js';

import { XernerxEventBuilder } from '../build/XernerxEventBuilder.js';
import { XernerxClient } from '../client/XernerxClient.js';
import { XernerxSlashCommandBuilder } from '../build/XernerxSlashCommandBuilder.js';
import { XernerxError } from '../tools/XernerxError.js';
import { XernerxSuccess } from '../tools/XernerxSuccess.js';
import { XernerxInfo } from '../tools/XernerxInfo.js';
import { XernerxUser } from '../model/XernerxUser.js';
import { XernerxContextCommandBuilder } from '../build/XernerxContextCommandBuilder.js';

export class XernerxClientReadyEvent extends XernerxEventBuilder {
	declare private readonly commands: {
		global: Array<XernerxSlashCommandBuilder | XernerxContextCommandBuilder>;
		local: Array<XernerxSlashCommandBuilder | XernerxContextCommandBuilder>;
	};

	constructor() {
		super('XernerxClientReadyEvent', {
			name: 'clientReady',
			emitter: 'client',
			once: true,
		});

		this.commands = {
			global: [],
			local: [],
		};
	}

	override async run(client: XernerxClient) {
		client.cluster?.triggerReady();

		// premium for owners

		if (client.settings.owners?.length) {
			const owners = [];

			if (client.premium?.synchronize) new XernerxInfo(`Synchronizing entitlements for premium owners...`);

			for (const owner of client.settings.owners) {
				const user = await client.users.fetch(owner);

				new XernerxUser(client as Client<true>, user).synchronize();

				owners.push(user);
			}

			if (client.premium?.synchronize) new XernerxSuccess(`Successfully synchronized entitlements for ${owners.map((owner) => owner.username).join(',')}`);
		}

		// interaction commands
		try {
			const commands = [...client.commands.slash, ...client.commands.context].map(([, command]) => command);

			if (!client.settings.global) {
				this.commands.global = [];
				this.commands.local = commands;
			} else {
				this.commands.global = commands.filter((command) => command.deploy?.global);
				this.commands.local = commands.filter((command) => !command.deploy?.global);
			}

			this.put(client);
		} catch (error) {
			new XernerxError((error as Error).message);
		}
	}

	async put(client: XernerxClient) {
		const rest = new REST({ version: GatewayVersion }).setToken(client.token);

		if (this.commands.global.length) {
			if (!client.settings.global) return new XernerxInfo('Loading commands locally');

			await rest.put(Routes.applicationCommands(client.user?.id as string), { body: this.commands.global.map((command) => command.data.toJSON()) });

			new XernerxSuccess(`Successfully deployed commands globally.`);
		}

		if (this.commands.local.length) {
			const guilds: { [index: string]: Array<XernerxSlashCommandBuilder | XernerxContextCommandBuilder> } = {};

			for (const command of this.commands.local) {
				(command.deploy?.guilds as Array<string>)?.map((id) => (guilds[id] ? guilds[id].push(command) : (guilds[id] = [command])));
			}

			if (!client.settings.guildId?.length && !Object.keys(guilds).length) return new XernerxError('Cannot locally deploy commands without a guild ID');

			(client.settings.guildId as Array<string>).map((id: string) => (guilds[id] ? guilds[id] : (guilds[id] = this.commands.local)));

			const deployed: { success: Array<string>; failed: Record<string, string> } = {
				success: [],
				failed: {},
			};

			for (const [guildId, commands] of Object.entries(guilds)) {
				try {
					await rest.put(Routes.applicationGuildCommands(client.user?.id as string, guildId), { body: commands.map((command) => command.data.toJSON()) });

					deployed.success.push(guildId);
				} catch (error) {
					deployed.failed[guildId] = (error as Error).message;
				}
			}

			if (deployed.success.length) {
				new XernerxSuccess(`Successfully deployed commands locally in ${deployed.success.join(', ')}`);
			}
			if (Object.keys(deployed.failed).length)
				new XernerxError(
					`Unable to deploy commands locally in ${Object.entries(deployed.failed)
						.map(([id, message]) => `${id} (${message})`)
						.join(', ')}`
				);
		}
	}
}
