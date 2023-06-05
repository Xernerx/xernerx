import { MessagePayload } from 'discord.js';
import XernerxClient from '../client/XernerxClient.js';
import { XernerxInteraction } from '../types/types.js';
import Util from './Util.js';
export default class InteractionUtil extends Util {
    private interaction;
    constructor(client: XernerxClient, interaction: XernerxInteraction);
    reply(content: MessagePayload): Promise<import("discord.js").Message<boolean> | import("discord.js").InteractionResponse<boolean>>;
    delay(time: number): Promise<unknown>;
}
//# sourceMappingURL=InteractionUtil.d.ts.map