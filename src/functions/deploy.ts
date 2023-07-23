import { GatewayVersion, REST, Routes } from 'discord.js';

import XernerxContextCommand from '../build/XernerxContextCommand.js';
import XernerxSlashCommand from '../build/XernerxSlashCommand.js';
import XernerxClient from '../client/XernerxClient.js';
import XernerxLog from '../tools/XernerxLog.js';
import XernerxError from '../tools/XernerxError.js';
import { Style } from 'dumfunctions';

const commands: Array<XernerxSlashCommand | XernerxContextCommand | any> = [];

export default function deploy(client: XernerxClient) {
    client.prependOnceListener('ready', (client) => {
        if (client.commands.slash.size) client.commands.slash.map((command: XernerxSlashCommand | XernerxContextCommand) => commands.push(command.data.toJSON()));
        if (client.commands.context.size) client.commands.context.map((command: XernerxSlashCommand | XernerxContextCommand) => commands.push(command.data.toJSON()));

        if (commands.length <= 0) return;

        try {
            if (client.settings.global) {
                put(client, client.settings.global, commands);
                put(client, !client.settings.global, []);
            } else {
                put(client, !client.settings.global, commands);
                put(client, client.settings.global, []);
            }
        } catch (error) {
            new XernerxLog(client).error(`An error occurred while deploying the interaction commands!`, error);
        } finally {
            new XernerxLog(client).info(
                `Deployed ${Style.log(String([client.commands.message.size, client.commands.slash.size, client.commands.context.size].reduce((a, b) => (a += b))), {
                    color: Style.TextColor.Cyan,
                })} Commands ${
                    client.settings.global
                        ? Style.log('globally', { color: Style.TextColor.Green })
                        : `${Style.log('locally', { color: Style.TextColor.Red })} in ${Style.log(client.guilds.cache.get(client.settings.local).name, { color: Style.TextColor.Blue })}`
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
