import { z } from 'zod';

import * as path from 'path';

import XernerxClient from '../client/XernerxClient.js';
import Handler from './Handler.js';
import { InhibitorHandlerOptions } from '../types/interfaces.js';
import XernerxLog from '../tools/XernerxLog.js';

export default class InhibitorHandler extends Handler {
    constructor(client: XernerxClient) {
        super(client);
    }

    public async loadInhibitors(options: InhibitorHandlerOptions) {
        options = z
            .object({
                directory: z.string(),
            })
            .parse(options);

        this.client.modules.options.inhibitors = options;

        const files = this.readdir(options.directory);

        for (const file of files) {
            const filePath = `${path.resolve(options.directory)}\\${file}`;

            const data = await this.load(filePath, 'Inhibitor');

            this.emit(data);
        }

        new XernerxLog(this.client).info(`Loaded ${this.client.inhibitors.size} Inhibitors.`);
    }
}
