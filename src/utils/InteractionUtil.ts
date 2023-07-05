import { InteractionEditReplyOptions, InteractionReplyOptions, MessagePayload } from 'discord.js';

import delay from '../functions/delay.js';
import XernerxClient from '../client/XernerxClient.js';
import { XernerxInteraction } from '../types/types.js';
import Util from './Util.js';
import { XernerxMessageContextInteraction, XernerxSlashInteraction, XernerxUserContextInteraction } from '../main.js';

export default class InteractionUtil extends Util {
    private interaction;

    constructor(client: XernerxClient, interaction: XernerxInteraction<XernerxSlashInteraction | XernerxUserContextInteraction | XernerxMessageContextInteraction>) {
        super(client);

        this.interaction = interaction;
    }

    public async reply(content: string | MessagePayload | InteractionReplyOptions | InteractionEditReplyOptions) {
        return await (this.interaction.replied || this.interaction.deferred ? this.interaction.editReply(content) : this.interaction.reply(content as InteractionReplyOptions));
    }

    public async delay(time: number) {
        return await delay(time);
    }
}
