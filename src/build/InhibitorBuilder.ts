import { z } from 'zod';

import XernerxClient from '../client/XernerxClient.js';
import { InhibitorBuilderOptions, MessageCommandArguments, SlashCommandArguments } from '../types/interfaces.js';
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
    public declare readonly id;
    public declare readonly name;
    public declare readonly type: InhibitorType;
    public declare readonly client;

    public constructor(id: string, options: InhibitorBuilderOptions) {
        this.id = id;

        z.object({
            name: z.string(),
            type: z.string(),
        }).parse(options);

        this.name = options.name;

        this.type = options.type;

        this.client = XernerxClient;
    }

    public async check<T>(action: XernerxInteraction | XernerxMessage, args: T) {}
}
