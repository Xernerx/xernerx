/** @format */

import { User } from 'discord.js';

import { Client } from 'discord.js';
import { XernerxClient } from '../main.js';
import XernerxEntitlement from './XernerxEntitlement.js';

export default class XernerxUser extends User {
	public declare readonly owner: boolean;
	public declare readonly premium: { items: Array<XernerxEntitlement>; archive: Array<XernerxEntitlement>; tier: XernerxEntitlement | null };

	constructor(client: XernerxClient & Client<true>, data: any) {
		super(client, data);

		this.owner = client.settings.ownerId.includes(this.id);

		this.premium = {
			tier: client.store.items.find((item: XernerxEntitlement) => item.userId == this.id && item.sku.type == 'Subscription') || null,
			items: client.store.items.filter((item: XernerxEntitlement) => item.userId == this.id),
			archive: client.store.archive.filter((item: XernerxEntitlement) => item.userId == this.id),
		};
	}
}
