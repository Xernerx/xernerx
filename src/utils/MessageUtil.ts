import { ChannelType, ForumChannel, MessageEditOptions, MessagePayload, MessageReplyOptions, NewsChannel, TextChannel, User } from 'discord.js';

import delay from '../functions/delay.js';
import XernerxClient from '../client/XernerxClient.js';
import { XernerxMessage } from '../types/extenders.js';
import Util from './Util.js';
import sendWebhook from '../functions/sendWebhook.js';
import XernerxError from '../tools/XernerxError.js';

export default class MessageUtil extends Util {
    private readonly message;

    public declare parsed: {
        alias: null | string;
        prefix: null | string;
    };

    constructor(client: XernerxClient, message: XernerxMessage) {
        super(client);

        this.message = message;

        this.parsed = {
            alias: null,
            prefix: null,
        };
    }

    public async reply(content: string | MessagePayload | MessageReplyOptions | MessageEditOptions) {
        if (this.client.cache.messages.has(this.message.id)) {
            const id = this.client.cache.messages.get(this.message.id);

            if (!id) return null;

            const msg = await this.message.channel.messages.fetch(id);

            msg.edit(content as MessageEditOptions);

            return msg;
        }

        const msg = await this.message.reply(content as MessageReplyOptions);

        this.client.cache.messages.set(this.message.id, msg.id);

        return msg;
    }

    public async webhookReply(content: MessagePayload, url?: URL, user?: User) {
        if (this.message.channel.type === ChannelType.DM) throw new XernerxError(`Can't use this method in DM Channels`);

        const channel = this.message.channel as TextChannel | NewsChannel | ForumChannel;

        let webhook;

        if (!url) {
            webhook = await channel.createWebhook({
                name: user?.username || (this.client.user?.username as string),
                avatar: user?.avatarURL() || this.client.user?.avatarURL(),
            });
        }

        if (!webhook) webhook = { url };

        await sendWebhook(webhook.url as URL, content);

        if (!url) (webhook as Record<'delete', Function>).delete();

        return;
    }

    public async delay(time: number) {
        return await delay(time);
    }
}
