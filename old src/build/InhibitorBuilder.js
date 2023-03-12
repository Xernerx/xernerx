import { z } from 'zod';
import XernerxClient from '../client/XernerxClient.js';
/**
 * @description - The inhibitor builder for inhibitors.
 * @param {String} id - The unique ID of the inhibitor.
 * @param {InhibitorOptions} options - The inhibitor options.
 */
export default class InhibitorBuilder {
    id;
    name;
    type;
    client;
    constructor(id, options) {
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
    async check(interaction, args) { }
}
