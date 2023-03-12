import { z } from 'zod';

import XernerxClient from '../client/XernerxClient.js';
import { InhibitorOptions, MessageArgumentOptions, SlashArgumentOptions } from '../types/options.js';
import { XernerxInteraction, XernerxMessage } from '../types/types.js';

/**
 * @description - The inhibitor builder for inhibitors.
 * @param {String} id - The unique ID of the inhibitor.
 * @param {InhibitorOptions} options - The inhibitor options.
 */
export default class InhibitorBuilder {
    public id;
    public name;
    public type;
    public client;

    constructor(id: string, options: InhibitorOptions) {
        this.id = id;

        z.object({
            name: z.string(),
            type: z.string(),
        }).parse(options);

        this.name = options.name;

        this.type = options.type;

        this.client = XernerxClient;
    }

    /**
     * TODO - update description
     */
    public async check(interaction: XernerxInteraction | XernerxMessage, args: SlashArgumentOptions | MessageArgumentOptions) {}
}
