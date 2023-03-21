import XernerxError from './XernerxError.js';
import { Style } from 'dumfunctions';
import XernerxClient from '../main.js';
export default class XernerxLog {
    public info(message: string) {
        return console.info(`${Style.log('Xernerx', { color: Style.TextColor.Purple })} | ${message}`);
    }

    public warn(message: string) {
        return console.warn(`${Style.log('Xernerx', { color: Style.TextColor.Yellow })} | ${message}`);
    }

    public error(message: string, error?: XernerxError | unknown) {
        return console.error(`${Style.log('Xernerx', { color: Style.TextColor.Red })} | ${message}${error ? ` | ${(error as Record<string, string>).stack}` : ''}`);
    }

    public ready(client: XernerxClient) {
        client.once('ready', async (synced) =>
            this.info(
                `${synced.user.tag} is now watching ${(await client.guilds.fetch()).size} guilds, ${
                    client.modules.options.slash?.guildId ? `using ${await client.guilds.fetch(client.modules.options.slash?.guildId)} as local guild.` : ''
                }`
            )
        );
    }
}
