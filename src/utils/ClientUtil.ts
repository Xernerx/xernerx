import setPresence from '../functions/setPresence.js';
import XernerxClient from '../client/XernerxClient.js';
import { PresenceOptions } from '../types/interfaces.js';
import Util from './Util.js';

export default class ClientUtil extends Util {
    public declare hasVoted?: Function;

    constructor(client: XernerxClient) {
        super(client);
    }

    public setPresence(options: PresenceOptions) {
        return setPresence(this.client, options);
    }

    public async resolveChannel(query: string | Record<string, string>) {
        let channelId = null;

        if (typeof query === 'object') channelId = query.id;

        if (typeof query === 'string') channelId = parseInt(query.replace(/<#|>/gim, '')) ? query.replace(/<#|>/gim, '') : query;

        if (!channelId) return null;

        try {
            return await this.client.channels.fetch(channelId);
        } catch {
            return null;
        }
    }
}
