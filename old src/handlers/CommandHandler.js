import Handler from './Handler.js';
import { MessageCommandEvents } from '../models/Events.js';
/**
 * @description - The command handler.
 * @param {XernerxClient} client - The XernerxClient.
 */
export default class CommandHandler extends Handler {
    constructor(client) {
        super(client);
    }
    /**
     * @description - The message command loader.
     * @param {MessageCommandOptions} options - message command loader options.
     */
    loadMessageCommands(options) {
        this.readdir(options.directory);
        // load()
        const events = new MessageCommandEvents(this.client);
        events.messageCreate();
        events.messageUpdate();
        events.messageDelete();
    }
}
