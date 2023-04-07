import XernerxError from './XernerxError.js';
import { Style } from 'dumfunctions';
import XernerxClient from '../client/XernerxClient.js';
export default class XernerxLog {
    private readonly client;
    private readonly errorLog;
    private readonly infoLog;
    private readonly readyLog;

    constructor(client: XernerxClient) {
        this.client = client;

        this.errorLog = client.settings.log?.error;

        this.infoLog = client.settings.log?.info;

        this.readyLog = client.settings.log?.ready;
    }

    public info(message: string, force: boolean = false) {
        return this.infoLog || force ? console.info(`${Style.log('✔️  | Xernerx', { color: Style.TextColor.Purple })} | ${message}`) : null;
    }

    public warn(message: string) {
        return this.infoLog ? console.warn(`${Style.log('⚠️  | Xernerx', { color: Style.TextColor.Yellow })} | ${message}`) : null;
    }

    public error(message: string, error?: XernerxError | unknown) {
        return this.errorLog ? console.error(`${Style.log('❗ | Xernerx', { color: Style.TextColor.Red })} | ${message}${error ? ` | ${(error as Record<string, string>).stack}` : ''}`) : null;
    }

    public ready() {
        this.client.prependOnceListener('ready', async (synced) =>
            this.info(
                `${synced.user.tag} is now online, watching ${(await this.client.guilds.fetch()).size} guilds, using ${await this.client.guilds.fetch(this.client.settings.local)} as local guild.`,
                this.readyLog
            )
        );
    }
}
