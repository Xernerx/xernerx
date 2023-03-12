import { z } from 'zod';

import * as path from 'path';

import XernerxClient from '../client/XernerxClient.js';
import { EventHandlerOptions } from '../types/interfaces.js';
import Handler from './Handler.js';

export default class EventHandler extends Handler {
    constructor(client: XernerxClient) {
        super(client);
    }

    public async loadEvents(options: EventHandlerOptions) {
        // options = z.object({
        //     directory: z.string(),
        // });

        this.client.modules.options.events = options;

        const files = this.readdir(options.directory);

        for (const file of files) {
            const filePath = `${path.resolve(options.directory)}\\${file}`;

            const data = await this.load(filePath, 'Event');

            this.emit(data);
        }
    }
}
