import { MessagePayload } from 'discord.js';

import delay from '../functions/delay.js';
import XernerxClient from '../client/XernerxClient.js';
import { XernerxInteraction } from '../types/types.js';
import Util from './Util.js';

export default class InteractionUtil extends Util {
    private interaction;

    constructor(client: XernerxClient, interaction: XernerxInteraction) {
        super(client);

        this.interaction = interaction;
    }

    public async reply(content: MessagePayload) {
        return await (this.interaction.replied || this.interaction.deferred ? this.interaction.editReply(content) : this.interaction.reply(content));
    }

    public async delay(time: number) {
        return await delay(time);
    }
}
