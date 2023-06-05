import { ContextCommandBuilder, MessageCommandBuilder, SlashCommandBuilder } from '../main.js';
import { XernerxMessage } from '../types/extenders.js';
import { InhibitorType, XernerxInteraction } from '../types/types.js';
export declare function inhibitorValidation(event: XernerxMessage | XernerxInteraction, cmd?: ContextCommandBuilder | MessageCommandBuilder | SlashCommandBuilder): Promise<boolean>;
export declare function inhibitorArguments(event: XernerxMessage | XernerxInteraction, cmd: ContextCommandBuilder | MessageCommandBuilder | SlashCommandBuilder | null, type: InhibitorType): MessageCommandBuilder | SlashCommandBuilder | ContextCommandBuilder | import("discord.js").Guild | import("discord.js").GuildMember | import("discord.js").User | import("discord.js").TextBasedChannel | import("../main.js").APIInteractionGuildMember | null;
//# sourceMappingURL=inhibitorValidations.d.ts.map