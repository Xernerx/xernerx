/** @format */

import { BaseGuild } from 'discord.js';

export default class XernerxGuild extends BaseGuild {
	declare public readonly premium: Array<any>;

	constructor(client: any, data: any) {
		super(client, data);

		this.premium = client.store.filter((sku: any) => sku.guild_id == this.id);
	}
}
