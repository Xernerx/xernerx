import XernerxClient from '../client/XernerxClient.js';
import { EventOptions } from '../types/options.js';
/**
 * @description - The event builder for  events.
 * @param {String} id - The unique ID of the event.
 * @param {EventOptions} options - The event options.
 */
export default class EventBuilder {
    id: string;
    name: string;
    emitter: string;
    type: string;
    once: boolean;
    client: typeof XernerxClient;
    constructor(id: string, options: EventOptions);
    /**
     * @description run your custom event here.
     * TODO - update description
     */
    run(): Promise<void>;
}
