import { MessagePayload, User } from 'discord.js';
import XernerxClient from '../client/XernerxClient.js';
import { XernerxMessage } from '../types/extenders.js';
import Util from './Util.js';
export default class MessageUtil extends Util {
    private readonly message;
    parsed: {
        alias: null | string;
        prefix: null | string;
    };
    constructor(client: XernerxClient, message: XernerxMessage);
    reply(content: MessagePayload): Promise<import("discord.js").Message<boolean> | undefined>;
    webhookReply(content: MessagePayload, url?: URL, user?: User): Promise<void>;
    delay(time: number): Promise<unknown>;
}
//# sourceMappingURL=MessageUtil.d.ts.map