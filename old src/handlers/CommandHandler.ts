import XernerxClient from '../client/XernerxClient.js';
import Handler from './Handler.js';
import { CommandsDeploy, ContextCommandEvents, MessageCommandEvents, SlashCommandEvents } from '../models/Events.js';
import { ContextCommandHandlerOptions, MessageCommandHandlerOptions, SlashCommandHandlerOptions } from '../types/options.js';
import { util } from '../main.js';
import load from '../functions/load.js';

/**
 * @description - The command handler.
 * @param {XernerxClient} client - The XernerxClient.
 */
export default class CommandHandler extends Handler {
    constructor(client: XernerxClient) {
        super(client);
    }

    /**
     * @description - The message command loader.
     * @param {MessageCommandOptions} options - message command loader options.
     */
    public loadMessageCommands(options: MessageCommandHandlerOptions) {
        this.readdir(options.directory);
        // load()

        const events = new MessageCommandEvents(this.client);

        events.messageCreate();

        events.messageUpdate();

        events.messageDelete();
    }

    /**
     * @description - The slash command loader.
     * @param {SlashCommandOptions} options - slash command loader options.
     */
    // public loadAllSlashCommands(options: SlashCommandHandlerOptions) {
    //     this.handler.loadAllSlashCommands(options);

    //     new SlashCommandEvents(this.client).slashCreate();
    // }

    // /**
    //  * @description - The context command loader.
    //  * @param {ContextCommandOptions} options - context command loader options.
    //  */
    // public loadAllContextCommands(options: ContextCommandHandlerOptions) {
    //     this.handler.loadAllContextCommands(options);

    //     new ContextCommandEvents(this.client).contextCreate();
    // }
}
