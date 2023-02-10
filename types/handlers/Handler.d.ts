import XernerxClient from '../client/XernerxClient.js';
import { ContextCommandHandlerOptions, EventHandlerOptions, InhibitorHandlerOptions, MessageCommandHandlerOptions, SlashCommandHandlerOptions } from '../types/options.js';
/**
 * @description - The Handler class.
 * @param {XernerxClient} client - The XernerxClient.
 */
export declare class Handler {
    private client;
    commands: object[];
    readyTimestamp: number;
    constructor(client: XernerxClient);
    /**
     * @description - The loader for the message commands.
     * @param {MessageCommandOptions} options - The options for the message command loader.
     */
    loadAllMessageCommands(options: MessageCommandHandlerOptions): void;
    /**
     * @description - The loader for the slash commands.
     * @param {SlashCommandOptions} options - The options for the slash command loader.
     */
    loadAllSlashCommands(options: SlashCommandHandlerOptions): void;
    /**
     * @description - The loader for the context commands.
     * @param {ContextCommandOptions} options - The options for the context command loader.
     */
    loadAllContextCommands(options: ContextCommandHandlerOptions): void;
    /**
     * @description - The loader for the events.
     * @param {EventLoadOptions} options - The options for the event loader.
     */
    loadAllEvents(options: EventHandlerOptions): void;
    /**
     * @description - The loader for the inhibitors.
     * @param {InhibitorLoadOptions} options - The options for the inhibitor loader.
     */
    loadAllInhibitors(options: InhibitorHandlerOptions): void;
    /**
     * @description - a reader for directories
     * @param {string} dir - the directory to look for.
     * @returns array of files.
     */
    private readdir;
    /**
     * @description file loader.
     * @param {string} dir - the directory.
     * @param {string} file - the file in the directory.
     * @param {string} type - the type of file.
     * @returns undefined
     */
    private load;
    /**
     * @description the event emitter to emit all events.
     * @param {object} event - the event to be emitted.
     * @returns void
     */
    private emitter;
}
