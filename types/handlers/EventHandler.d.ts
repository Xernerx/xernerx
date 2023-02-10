import XernerxClient from '../client/XernerxClient.js';
import { EventHandlerOptions } from '../types/options.js';
import { Handler } from './Handler.js';
export default class EventHandler {
    client: XernerxClient;
    handler: Handler;
    constructor(client: XernerxClient);
    /**
     * @description - The event loader
     * @param {EventLoadOptions} options - message command options
     */
    loadAllEvents(options: EventHandlerOptions): void;
}
