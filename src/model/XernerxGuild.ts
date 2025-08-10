/** @format */

import { BaseGuild, Client } from 'discord.js';

export class XernerxGuild extends BaseGuild {
	constructor(client: Client<true>, guild: BaseGuild) {
		super(client, guild as any);
	}

	consumeEntitlement() {}

	entitlements() {}
}
