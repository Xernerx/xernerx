import XernerxClient from '../client/XernerxClient.js';
import { XernerxMessage, XernerxSlashInteraction, XernerxUser, XernerxUserContextInteraction } from '../types/extenders.js';
import isOwner from './isOwner.js';

export async function xernerxUser(event: XernerxMessage | XernerxSlashInteraction | XernerxUserContextInteraction | XernerxUserContextInteraction, client: XernerxClient) {
    const author = (event as XernerxMessage).author || event.user;

    const user: Partial<XernerxUser> = author;

    'owner' in user ? null : (user.owner = isOwner(user as XernerxUser, client));

    'voted' in user ? null : (user.voted = client.util.hasVoted ? await client.util.hasVoted(user.id) : null);

    return user as XernerxUser;
}
