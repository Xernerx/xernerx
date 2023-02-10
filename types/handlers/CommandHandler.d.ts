import XernerxClient from '../client/XernerxClient.js';
import { Handler } from './Handler.js';
import { ContextCommandHandlerOptions, MessageCommandHandlerOptions, SlashCommandHandlerOptions } from '../types/options.js';
/**
 * @description - The command handler.
 * @param {XernerxClient} client - The XernerxClient.
 */
export default class CommandHandler {
    client: XernerxClient;
    handler: Handler;
    constructor(client: XernerxClient);
    /**
     * @description - The message command loader.
     * @param {MessageCommandOptions} options - message command loader options.
     */
    loadAllMessageCommands(options: MessageCommandHandlerOptions): void;
    /**
     * @description - The slash command loader.
     * @param {SlashCommandOptions} options - slash command loader options.
     */
    loadAllSlashCommands(options: SlashCommandHandlerOptions): void;
    /**
     * @description - The context command loader.
     * @param {ContextCommandOptions} options - context command loader options.
     */
    loadAllContextCommands(options: ContextCommandHandlerOptions): void;
}
