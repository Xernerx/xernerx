import XernerxClient from '../client/XernerxClient.js';
import { InhibitorHandlerOptions } from '../types/options.js';
import { Handler } from './Handler.js';
/**
 * @description - Inhibitor loader.
 * @param {XernerxClient} client - The XernerxClient.
 */
export default class InhibitorHandler {
    client: XernerxClient;
    handler: Handler;
    constructor(client: XernerxClient);
    /**
     * @description - The loader for all inhibitors.
     * @param {InhibitorLoadOptions} options - the inhibitor loader options.
     * @returns undefined
     */
    loadAllInhibitors(options: InhibitorHandlerOptions): void;
}
