/** @format */

import { User } from 'discord.js';
import XernerxClient from '../client/XernerxClient.js';
import { XernerxMessage, XernerxSlashInteraction, XernerxUser, XernerxUserContextInteraction } from '../types/extenders.js';

export async function xernerxUser(event: XernerxMessage | XernerxSlashInteraction | XernerxUserContextInteraction | XernerxUserContextInteraction, client: XernerxClient) {
	const author: User = (event as XernerxMessage).author || event.user;

	const user = {
		...author,
		owner: isOwner(client, author),
		voted: client.util.hasVoted ? await client.util.hasVoted(author.id) : null,
	};

	return user as XernerxUser;
}

function isOwner(client: XernerxClient, user: User) {
	return client.settings.ownerId.includes(user.id);
}
