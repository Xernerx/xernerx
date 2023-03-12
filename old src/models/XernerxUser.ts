import { XernerxUser } from '../types/types.js';
import { hasVoted } from 'dbl-sdk';

export default async function XernerxUser(interaction: any): Promise<XernerxUser> {
    const user = interaction.user || interaction.author;

    user.owner = interaction.client.util.isOwner(user.id);

    user.voter = interaction.client.handlerOptions?.webhook?.topgg?.token
        ? await hasVoted(user.id, interaction.client.user.id, interaction.client.handlerOptions.webhook.topgg.token, 'top.gg')
        : false;

    return user;
}
