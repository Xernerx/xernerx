import { z } from 'zod';

import XernerxClient from '../client/XernerxClient.js';
import { EventType } from '../types/types.js';
// import { EventOptions } from '../types/options.js';

/**
 * @description - The event builder for  events.
 * @param {String} id - The unique ID of the event.
 * @param {EventOptions} options - The event options.
 */
export default class EventBuilder {
    public id: string;
    public name: EventType;
    public emitter: 'client' | 'process' | string;
    public type: 'discord' | string;
    public once: boolean;
    public client;

    constructor(id: string, options: any) {
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
    public async run<T extends Array<T>>(...args: T) {}
}
