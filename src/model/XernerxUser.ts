/** @format */

import { Client, User } from 'discord.js';
import { XernerxMonitisation } from './XernerxMonitisation.js';

export class XernerxUser extends User {
	readonly #monitisation: XernerxMonitisation;

	constructor(client: Client<true>, user: User) {
		super(client, user as any);

		this.#monitisation = new XernerxMonitisation(client);
	}
	consumeEntitlement() {}

	async entitlements() {
		const entitlements = await this.#monitisation.entitlements({ user_id: this.id });

		const SKU = await this.#monitisation.sku();

		return entitlements.map((entitlement) => ({ entitlement: entitlement, sku: SKU.find((sku) => sku.id === entitlement.sku_id) }));
	}
}
