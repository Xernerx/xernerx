import { z } from 'zod';

import XernerxClient from '../client/XernerxClient.js';
import { EventBuilderOptions } from '../types/interfaces.js';
import { EventType } from '../types/types.js';
// import { EventOptions } from '../types/options.js';

/**
 * @description - The event builder for  events.
 * @param {String} id - The unique ID of the event.
 * @param {EventOptions} options - The event options.
 */
export default class EventBuilder {
    public declare readonly id: string;
    public declare readonly name: EventType | string;
    public declare readonly emitter?: 'client' | 'process' | string;
    public declare readonly type?: 'discord' | string;
    public declare readonly once?: boolean;
    public declare readonly fileType: 'Event';
    public declare readonly filePath: string;
    public declare readonly client;

    public constructor(id: string, options: EventBuilderOptions) {
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
    public async run(): Promise<void | any> {}
}
