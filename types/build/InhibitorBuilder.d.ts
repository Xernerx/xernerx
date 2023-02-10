import XernerxClient from '../client/XernerxClient.js';
import { InhibitorOptions, MessageArgumentOptions, SlashArgumentOptions } from '../types/options.js';
import { XernerxInteraction, XernerxMessage } from '../types/types.js';
/**
 * @description - The inhibitor builder for inhibitors.
 * @param {String} id - The unique ID of the inhibitor.
 * @param {InhibitorOptions} options - The inhibitor options.
 */
export default class InhibitorBuilder {
    id: string;
    name: string;
    type: import('../main.js').InhibitorType;
    client: typeof XernerxClient;
    constructor(id: string, options: InhibitorOptions);
    /**
     * TODO - update description
     */
    check(interaction: XernerxInteraction | XernerxMessage, args: SlashArgumentOptions | MessageArgumentOptions): Promise<void>;
}
