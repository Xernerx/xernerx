import ContextCommandBuilder from '../build/ContextCommandBuilder.js';
import MessageCommandBuilder from '../build/MessageCommandBuilder.js';
import SlashCommandBuilder from '../build/SlashCommandBuilder.js';
import { XernerxMessage } from '../types/extenders.js';
import { XernerxInteraction } from '../types/types.js';
export default function commandValidation(event: XernerxInteraction | XernerxMessage, command: MessageCommandBuilder | SlashCommandBuilder | ContextCommandBuilder): Promise<boolean>;
//# sourceMappingURL=commandValidation.d.ts.map