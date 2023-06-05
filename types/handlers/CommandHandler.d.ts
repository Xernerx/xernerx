import XernerxClient from '../client/XernerxClient.js';
import { ContextHandlerOptions, MessageHandlerOptions, SlashHandlerOptions } from '../types/interfaces.js';
import Handler from './Handler.js';
export default class CommandHandler extends Handler {
    constructor(client: XernerxClient);
    loadMessageCommands(options: MessageHandlerOptions): void;
    loadSlashCommands(options: SlashHandlerOptions): void;
    loadContextCommands(options: ContextHandlerOptions): void;
    private messageCommandRun;
    private slashCommandRun;
    private contextCommandRun;
    private exec;
}
//# sourceMappingURL=CommandHandler.d.ts.map