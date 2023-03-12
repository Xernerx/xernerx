import XernerxClient from '../client/XernerxClient.js';
import Handler from './Handler.js';
import { MessageCommandHandlerOptions } from '../types/options.js';
/**
 * @description - The command handler.
 * @param {XernerxClient} client - The XernerxClient.
 */
export default class CommandHandler extends Handler {
    constructor(client: XernerxClient);
    /**
     * @description - The message command loader.
     * @param {MessageCommandOptions} options - message command loader options.
     */
    loadMessageCommands(options: MessageCommandHandlerOptions): void;
}
