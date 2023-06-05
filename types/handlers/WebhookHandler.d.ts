import XernerxClient from '../client/XernerxClient.js';
import Handler from './Handler.js';
export default class WebhookHandler extends Handler {
    constructor(client: XernerxClient);
    loadWebhooks(options: {
        token: string;
    }): Promise<void>;
    private post;
}
//# sourceMappingURL=WebhookHandler.d.ts.map