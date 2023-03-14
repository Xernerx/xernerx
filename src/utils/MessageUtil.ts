import delay from '../functions/delay.js';
import XernerxClient, { MessagePayload } from '../main.js';
import { XernerxMessage } from '../types/extenders.js';
import Util from './Util.js';

export default class MessageUtil extends Util {
    private message;

    constructor(client: XernerxClient, message: XernerxMessage) {
        super(client);

        this.message = message;
    }

    public async reply(content: MessagePayload) {
        if (this.client.cache.messages.has(this.message.id)) {
            const id = this.client.cache.messages.get(this.message.id);

            if (!id) return;

            const msg = await this.message.channel.messages.fetch(id);

            msg.edit(content);

            return msg;
        }

        const msg = await this.message.reply(content);

        this.client.cache.messages.set(this.message.id, msg.id);

        return msg;
    }

    public async delay(time: number) {
        return await delay(time);
    }
}
