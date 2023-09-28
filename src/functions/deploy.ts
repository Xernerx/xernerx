/** @format */

import { GatewayVersion, REST, Routes } from 'discord.js';

import XernerxContextCommand from '../build/XernerxContextCommand.js';
import XernerxSlashCommand from '../build/XernerxSlashCommand.js';
import XernerxClient from '../client/XernerxClient.js';
import XernerxLog from '../tools/XernerxLog.js';
import XernerxError from '../tools/XernerxError.js';
import { Style } from 'dumfunctions';
import { XernerxMessageCommand } from '../main.js';

const globalCommands: Array<XernerxSlashCommand | XernerxContextCommand | any> = [];
const localCommands: Array<XernerxSlashCommand | XernerxContextCommand | any> = [];

export default function deploy(client: XernerxClient) {
	const commands: Array<XernerxMessageCommand | XernerxSlashCommand | XernerxContextCommand> = [];

	client.prependOnceListener('ready', (client) => {
		client.commands.slash.map((command: XernerxSlashCommand) => commands.push(command));
		client.commands.context.map((command: XernerxContextCommand) => commands.push(command));
		client.commands.slash.map((command: XernerxMessageCommand) => commands.push(command));

		if (client.commands.slash.size)
			client.commands.slash.map((command: XernerxSlashCommand | XernerxContextCommand) => (command.global ? globalCommands.push(command.data.toJSON()) : localCommands.push(command.data.toJSON())));
		if (client.commands.context.size)
			client.commands.context.map((command: XernerxSlashCommand | XernerxContextCommand) => (command.global ? globalCommands.push(command.data.toJSON()) : localCommands.push(command.data.toJSON())));

		if (globalCommands.length <= 0 && localCommands.length <= 0) return;

		try {
			if (client.settings.global) {
				put(client, client.settings.global, globalCommands);
				put(client, !client.settings.global, localCommands);
			} else {
				put(client, !client.settings.global, [...globalCommands, ...localCommands]);
				put(client, client.settings.global, []);
			}
		} catch (error) {
			new XernerxLog(client).error(`An error occurred while deploying the commands!`, error);
		} finally {
			new XernerxLog(client).info(
				`Deployed ${Style.log(String(commands.filter((command) => command.global).length), {
					color: Style.TextColor.Cyan,
				})} Commands ${
					client.settings.global
						? Style.log('globally', { color: Style.TextColor.Green })
						: `${Style.log('locally', { color: Style.TextColor.Red })} in ${Style.log(client.guilds.cache.get(client.settings.local)?.name, { color: Style.TextColor.Blue })}`
				}.`
			);
		}
	});
}

function put(client: XernerxClient, global: boolean, body: Array<object>) {
	const rest = new REST({ version: GatewayVersion }).setToken(client.token as string);

	if (!global && !client.settings?.local) throw new XernerxError(`No guild ID provided as local guild!`);

	if (!global && client.settings?.local) rest.put(Routes.applicationGuildCommands(client.user?.id as string, client.settings.local), { body });
	else rest.put(Routes.applicationCommands(client.user?.id as string), { body });
}
