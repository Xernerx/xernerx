/** @format */

import { User } from 'discord.js';

import { Client } from 'discord.js';
import { XernerxClient } from '../main.js';
import XernerxEntitlement from './XernerxEntitlement.js';

export default class XernerxUser extends User {
	declare public readonly owner: boolean;
	declare public readonly premium: { items: Array<XernerxEntitlement>; archive: Array<XernerxEntitlement> };

	constructor(client: XernerxClient & Client<true>, data: any) {
		super(client, data);

		this.owner = client.settings.owners.includes(this.id);

		this.premium = {
			items: client.store.items.filter((item) => item.userId == this.id),
			archive: client.store.archive.filter((item) => item.userId == this.id),
		};
	}
}
