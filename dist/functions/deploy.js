/** @format */
import { GatewayVersion, REST, Routes } from 'discord.js';
import { Style } from 'dumfunctions';
import XernerxLog from '../tools/XernerxLog.js';
import XernerxError from '../tools/XernerxError.js';
const globalCommands = [];
const localCommands = [];
export default function deploy(client) {
	const commands = [];
	function stats() {
		client.stats.guildCount = client.guilds.cache.size;
		client.stats.userCount = client.guilds.cache.map((g) => g.memberCount || g.approximateMemberCount || 0).reduce((a, b) => (a += b), 0);
	}
	process.on('message', (message) => {
		if (message.type == 'xernerx') client.stats.shardId = message?.data?.shardId;
		if (message.type == 'client') client.data = message.data;
	});
	client.on('messageCreate', stats);
	client.on('interactionCreate', stats);
	client.once('ready', (client) => {
		stats();
		client.commands.slash.map((command) => commands.push(command));
		client.commands.context.map((command) => commands.push(command));
		client.commands.message.map((command) => commands.push(command));
		if (client.commands.slash.size) client.commands.slash.map((command) => (command.global ? globalCommands.push(command.data.toJSON()) : localCommands.push(command.data.toJSON())));
		if (client.commands.context.size) client.commands.context.map((command) => (command.global ? globalCommands.push(command.data.toJSON()) : localCommands.push(command.data.toJSON())));
		if (!globalCommands.length && !localCommands.length && !client.commands.message.size) return;
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
function put(client, global, body) {
	const rest = new REST({ version: GatewayVersion }).setToken(client.token);
	if (!global && !client.settings?.local) throw new XernerxError(`No guild ID provided as local guild!`);
	if (!global && client.settings?.local) return rest.put(Routes.applicationGuildCommands(client.user?.id, client.settings.local), { body });
	else return rest.put(Routes.applicationCommands(client.user?.id), { body });
}
