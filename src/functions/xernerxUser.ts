import XernerxClient from '../main.js';
import { XernerxMessage, XernerxSlashInteraction, XernerxUser, XernerxUserContextInteraction } from '../types/extenders.js';
import isOwner from './isOwner.js';

export async function xernerxUser(event: XernerxMessage | XernerxSlashInteraction | XernerxUserContextInteraction | XernerxUserContextInteraction, client: XernerxClient) {
    const author = (event as XernerxMessage).author || event.user;

    const user: Partial<XernerxUser> = author;

    // console.log(await client.util.hasVoted(user.id));

    'owner' in user ? null : (user.owner = isOwner(user as XernerxUser, client));
    'voted' in user ? null : (user.voted = null);

    return user as XernerxUser;
}
