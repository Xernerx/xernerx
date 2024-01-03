/** @format */

import { User } from 'discord.js';

import XernerxClient from '../client/XernerxClient.js';
import { XernerxMessage, XernerxSlashInteraction, XernerxUser, XernerxUserContextInteraction } from '../types/extenders.js';

export async function xernerxUser(event: XernerxMessage | XernerxSlashInteraction | XernerxUserContextInteraction | XernerxUserContextInteraction, client: XernerxClient) {
	const author: Partial<XernerxUser | User> = (event as XernerxMessage).author || event.user;

	(author as XernerxUser).owner = isOwner(client, author as User);
	if (client.dbl.validate) (author as XernerxUser).voted = await client?.dbl?.validate(author);

	return author as XernerxUser;
}

function isOwner(client: XernerxClient, user: User) {
	return client.settings.ownerId.includes(user.id);
}
