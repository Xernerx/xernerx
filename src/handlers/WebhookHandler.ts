import { DBL } from 'dbl-sdk';
import hasVoted from 'dbl-sdk/dist/cjs/models/hasVoted';
import { XernerxClient } from '../main';
import { WebhookOptions } from '../types/options';

export default class WebhookHandler {
    public client;

    constructor(client: XernerxClient) {
        this.client = client;
    }

    loadAllWebhooks(options: WebhookOptions) {
        this.client.once('ready', <T>(client: T) => {
            const { options: config } = new DBL(client as XernerxClient | any, options);

            (client as XernerxClient).util.hasVoted = hasVoted;

            (client as XernerxClient).handlerOptions.webhook = config as WebhookOptions;
        });
    }
}
