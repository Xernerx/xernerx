import { z } from 'zod';

import XernerxClient from '../client/XernerxClient.js';
import { InhibitorBuilderOptions } from '../types/interfaces.js';
import { InhibitorType, XernerxInteraction } from '../types/types.js';
import { XernerxMessage } from '../types/extenders.js';
// import { InhibitorOptions, MessageArgumentOptions, SlashArgumentOptions } from '../types/options.js';
// import { XernerxInteraction, XernerxMessage } from '../types/types.js';

/**
 * @description - The inhibitor builder for inhibitors.
 * @param {String} id - The unique ID of the inhibitor.
 * @param {InhibitorOptions} options - The inhibitor options.
 */
export default class InhibitorBuilder {
    public id;
    public name;
    public type: InhibitorType;
    public client;

    constructor(id: string, options: InhibitorBuilderOptions) {
        this.id = id;

        z.object({
            name: z.string(),
            type: z.string(),
        }).parse(options);

        this.name = options.name;

        this.type = options.type;

        this.client = XernerxClient;
    }

    public async check(action: XernerxInteraction | XernerxMessage, args: any) {}
}
