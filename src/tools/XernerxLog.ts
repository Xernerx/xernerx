import XernerxError from './XernerxError.js';
import { Style } from 'dumfunctions';
import XernerxClient from '../client/XernerxClient.js';
export default class XernerxLog {
    private declare readonly client;
    private declare readonly errorLog;
    private declare readonly infoLog;
    private declare readonly readyLog;
    private declare readonly tableLog;

    constructor(client: XernerxClient) {
        this.client = client;

        this.errorLog = client.settings.log?.error;

        this.infoLog = client.settings.log?.info;

        this.readyLog = client.settings.log?.ready;

        this.tableLog = client.settings.log?.table;
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
        this.client.prependOnceListener('ready', async (synced) => {
            this.info(
                `${synced.user.tag} is now online, watching ${(await this.client.guilds.fetch()).size} guilds, using ${
                    this.client.settings.local ? await this.client.guilds.fetch(this.client.settings.local) : 'none'
                } as local guild.`,
                this.readyLog
            );

            const files: Array<object> = [];

            for (const [id, data] of this.client.commands.message) {
                files.push(data);
            }

            for (const [id, data] of this.client.commands.slash) {
                files.push(data);
            }

            for (const [id, data] of this.client.commands.context) {
                files.push(data);
            }

            for (const [id, data] of this.client.events) {
                files.push(data);
            }

            for (const [id, data] of this.client.inhibitors) {
                files.push(data);
            }

            if (this.tableLog) {
                console.table(files, this.tableLog);
            }
        });
    }
}
