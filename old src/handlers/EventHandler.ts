import XernerxClient from '../client/XernerxClient.js';
import { EventHandlerOptions } from '../types/options.js';
import { Handler } from './Handler.js';

export default class EventHandler {
    client: XernerxClient;
    handler: Handler;

    constructor(client: XernerxClient) {
        this.client = client;

        this.handler = new Handler(client);
    }

    /**
     * @description - The event loader
     * @param {EventLoadOptions} options - message command options
     */
    public loadAllEvents(options: EventHandlerOptions) {
        return this.handler.loadAllEvents(options);
    }
}
