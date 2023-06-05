import XernerxClient from '../client/XernerxClient.js';
import MessageCommandBuilder from '../build/MessageCommandBuilder.js';
import SlashCommandBuilder from '../build/SlashCommandBuilder.js';
import ContextCommandBuilder from '../build/ContextCommandBuilder.js';
import { FileType } from '../types/types.js';
export default class Handler {
    readonly client: XernerxClient;
    readonly files: Array<MessageCommandBuilder | SlashCommandBuilder | ContextCommandBuilder>;
    readonly readyTimestamp: number;
    constructor(client: XernerxClient);
    readdir(dir: string): string[];
    load(filePath: string, type: FileType): Promise<any>;
    emit<T extends Record<string, string | boolean | Function | void>>(event: T): Promise<void>;
}
//# sourceMappingURL=Handler.d.ts.map