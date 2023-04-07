import XernerxClient from '../client/XernerxClient.js';
import { XernerxUser } from '../types/extenders.js';

export default function isOwner(user: Pick<XernerxUser, 'id'>, client: XernerxClient) {
    return client.settings.ownerId.includes(user.id);
}
