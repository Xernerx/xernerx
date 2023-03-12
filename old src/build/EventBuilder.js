import { z } from 'zod';
import XernerxClient from '../client/XernerxClient.js';
/**
 * @description - The event builder for  events.
 * @param {String} id - The unique ID of the event.
 * @param {EventOptions} options - The event options.
 */
export default class EventBuilder {
    id;
    name;
    emitter;
    type;
    once;
    client;
    constructor(id, options) {
        this.id = id;
        z.object({
            name: z.string(),
            emitter: z.string().optional(),
            type: z.string().optional(),
            once: z.boolean().optional(),
        }).parse(options);
        this.name = options.name;
        this.emitter = options.emitter || 'client';
        this.type = options.type || 'discord';
        this.once = options.once || false;
        this.client = XernerxClient;
    }
    /**
     * @description run your custom event here.
     * TODO - update description
     */
    async run() { }
}
