import MessageCommandBuilder from '../build/MessageCommandBuilder.js';
import { XernerxInteraction, XernerxMessage } from '../types/types.js';
export declare class InteractionArguments {
    interaction: XernerxInteraction;
    constructor(interaction: XernerxInteraction);
    group(): string | undefined;
    subcommand(): string | undefined;
    arguments(): Record<string, object>;
}
interface Flag {
    flags: Record<string, string | boolean>;
}
interface Argument {
    [index: string]: string | number | null;
}
export declare function messageArguments(message: XernerxMessage, command: MessageCommandBuilder): Promise<import('discord.js').Message<boolean> | Flag | Argument | undefined>;
export {};
