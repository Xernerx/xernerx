import XernerxClient from '../client/XernerxClient.js';
import Handler from './Handler.js';

export default class WebhookHandler extends Handler {
    constructor(client: XernerxClient) {
        super(client);
    }
}
