/** @format */

import { MonetizationAPI } from '@discordjs/core';
import { Client, RequestData, RESTGetAPIEntitlementsQuery } from 'discord.js';

export class XernerxMonitisation extends MonetizationAPI {
	declare private readonly client: Client<true>;

	constructor(client: Client<true>) {
		super(client.rest);

		this.client = client;
	}

	consume(id: string, options: 'auth' | 'signal') {
		return this.consumeEntitlement(id, options);
	}

	entitlements(id?: RESTGetAPIEntitlementsQuery, options?: Pick<RequestData, 'auth' | 'signal'>) {
		return this.getEntitlements(this.client.user.id, id || {}, options);
	}

	sku(options?: Pick<RequestData, 'auth' | 'signal'>) {
		return this.getSKUs(this.client.user.id, options);
	}

	create(id: string) {
		return this.createTestEntitlement(this.client.user.id, { owner_id: this.client.user.id, owner_type: 1, sku_id: id });
	}

	delete(id: string) {
		return this.deleteTestEntitlement(this.client.user.id, id);
	}
}
