import { DBL, hasVoted } from 'dbl-sdk';
import XernerxClient from '../client/XernerxClient.js';
import { DBLOptions } from '../types/interfaces.js';
import Handler from './Handler.js';

export default class WebhookHandler extends Handler {
    constructor(client: XernerxClient) {
        super(client);
    }

    loadWebhooks(options: DBLOptions) {
        this.client.once('ready', (client) => {
            new DBL(this.client as never, options);

            this.client.util.hasVoted = (userId: string) => hasVoted(userId, client.user?.id, options.topgg.token, 'top.gg');
        });
    }
}
