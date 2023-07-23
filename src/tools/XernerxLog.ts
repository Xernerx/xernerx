import XernerxError from './XernerxError.js';
import { Style } from 'dumfunctions';
import XernerxClient from '../client/XernerxClient.js';
// import { version } from '../main.js';

export default class XernerxLog {
    private declare readonly client;
    private declare readonly errorLog;
    private declare readonly infoLog;
    private declare readonly readyLog;
    private declare readonly tableLog;
    private declare readonly time;

    constructor(client: XernerxClient | true) {
        this.client = client;

        if (client == true) {
            this.errorLog = true;

            this.infoLog = true;
        } else {
            this.errorLog = client.settings.log?.error;

            this.infoLog = client.settings.log?.info;

            this.readyLog = client.settings.log?.ready;

            this.tableLog = client.settings.log?.table;
        }

        this.time = () => String(new Date()).split(/ +/)[4];
    }

    public info(message: string, force: boolean = false) {
        return this.infoLog || force
            ? console.info(`✔️  | ${Style.log('Xernerx', { color: Style.TextColor.Purple })} | ${Style.log(this.time(), { color: Style.TextColor.Cyan })} | ${message}`)
            : null;
    }

    public warn(message: string) {
        return this.infoLog ? console.warn(`⚠️  | ${Style.log('Xernerx', { color: Style.TextColor.Yellow })} | ${Style.log(this.time(), { color: Style.TextColor.Cyan })} | ${message}`) : null;
    }

    public error(message: string, error?: XernerxError | unknown) {
        return this.errorLog
            ? console.error(
                  `❗ | ${Style.log('Xernerx', { color: Style.TextColor.Red })} | ${Style.log(this.time(), { color: Style.TextColor.Cyan })} | ${message}${
                      error ? ` | ${(error as Record<string, string>).stack}` : ''
                  }`
              )
            : null;
    }

    public ready() {
        if (typeof this.client == 'boolean') return;

        const client = this.client as XernerxClient;

        this.client.prependOnceListener('ready', async (synced) => {
            this.info(
                `${Style.log(synced.user.tag, { color: Style.TextColor.Blue })} is now ${Style.log('online', { color: Style.TextColor.Green })}, watching ${Style.log(
                    String(client.guilds.cache.size),
                    {
                        color: Style.TextColor.Cyan,
                    }
                )} guild${client.guilds.cache.size > 1 ? 's' : ''}, using ${
                    client.settings.local ? Style.log((await client.guilds.fetch(client.settings.local)).name, { color: Style.TextColor.Blue }) : 'none'
                } as local guild.`,
                this.readyLog
            );

            const files: Array<object> = [];

            for (const [id, data] of client.commands.message) {
                files.push(data);
                id;
            }

            for (const [id, data] of client.commands.slash) {
                files.push(data);
                id;
            }

            for (const [id, data] of client.commands.context) {
                files.push(data);
                id;
            }

            for (const [id, data] of client.events) {
                files.push(data);
                id;
            }

            for (const [id, data] of client.inhibitors) {
                files.push(data);
                id;
            }

            if (this.tableLog) {
                console.table(files, this.tableLog);
            }
        });
    }
}
