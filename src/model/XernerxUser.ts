/** @format */

import { User } from 'discord.js';

import { Client } from 'discord.js';
import { XernerxClient } from '../main.js';

export default class XernerxUser extends User {
	declare public readonly owner: boolean;
	declare public readonly premium: Array<any>;

	constructor(client: XernerxClient & Client<true>, data: any) {
		super(client, data);

		this.owner = client.settings.owners.includes(this.id);

		this.premium = client.store.filter((sku: any) => sku.user_id == this.id);
	}
}
