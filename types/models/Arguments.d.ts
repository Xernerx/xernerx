import SlashCommandBuilder from '../build/SlashCommandBuilder.js';
import ContextCommandBuilder from '../build/ContextCommandBuilder.js';
import MessageCommandBuilder from '../build/MessageCommandBuilder.js';
import { XernerxMessage } from '../types/extenders.js';
import { MessageCommandArguments } from '../types/interfaces.js';
import { XernerxInteraction } from '../types/types.js';
export declare function messageArguments(message: XernerxMessage, command: MessageCommandBuilder): Promise<MessageCommandArguments>;
export declare function interactionArguments(interaction: XernerxInteraction | any, command: ContextCommandBuilder | SlashCommandBuilder): Promise<any>;
//# sourceMappingURL=Arguments.d.ts.map