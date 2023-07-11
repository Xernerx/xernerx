import setPresence from '../functions/setPresence.js';
import XernerxClient from '../client/XernerxClient.js';
import { PresenceOptions } from '../types/interfaces.js';
import Util from './Util.js';

export default class ClientUtil extends Util {
    public declare hasVoted: Function;

    constructor(client: XernerxClient) {
        super(client);
    }

    public setPresence(options: PresenceOptions) {
        return setPresence(this.client, options);
    }

    public async resolveChannel(query: string | Record<string, string>) {
        if (typeof query == 'object') query = query.id;

        try {
            let channel =
                this.client.channels.cache.find(<T>(channel: T) =>
                    (channel as Record<string, string>).name == (query as string).toLowerCase() || (channel as Record<string, string>).id == (query as string).toLowerCase() ? channel : null
                ) || null;

            if (!channel) channel = (await this.client.channels.fetch(query)) || null;

            return channel;
        } catch {
            return null;
        }
    }

    public async resolveGuild(query: string | Record<string, string>) {
        if (typeof query == 'object') query = query.id;

        try {
            let guild = this.client.guilds.cache.find((guild) => guild.name.toLowerCase() == (query as string).toLowerCase()) || null;

            if (!guild) guild = (await this.client.guilds.fetch(query)) || null;

            return guild;
        } catch {
            return null;
        }
    }
}
