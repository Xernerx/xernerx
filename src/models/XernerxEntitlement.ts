/** @format */

import { EntitlementType, SKUFlags, SKUType } from 'discord.js';
import { XernerxClient } from '../main.js';
import XernerxError from '../tools/XernerxError.js';

export default class XernerxEntitlement {
	public declare readonly id: string;
	public declare readonly skuId: string;
	public declare readonly clientId: string;
	public declare readonly userId: string;
	public declare readonly promotionId: string;
	public declare readonly dependentId: string;
	public declare readonly deleted: boolean;
	public declare readonly consumed: boolean;
	public declare readonly startsAt: Date;
	public declare readonly endsAt: Date;
	public declare readonly item;
	public declare readonly sku;
	public declare readonly details;
	private declare readonly client: XernerxClient;

	constructor(client: XernerxClient, sku: any, item: any) {
		this.id = item.id;

		this.skuId = item.sku_id;

		this.clientId = item.application_id;

		this.userId = item.user_id;

		this.promotionId = item.promotion_id;

		this.dependentId = sku.dependent_sku_id;

		this.deleted = item.deleted;

		this.consumed = item.consumed;

		this.startsAt = item.starts_at;

		this.endsAt = item.ends_at;

		this.item = {
			type: EntitlementType[item.type as number],
			flags: item.gift_code_flags as number,
		};

		this.sku = {
			type: SKUType[sku.type as number],
			flags: SKUFlags[sku.flags as number],
			productLine: sku.product_line as number,
			manifestLabels: sku.manifest_labels,
		};

		this.details = {
			slug: sku.slug as string,
			name: sku.name as string,
			description: sku.description as string,
			features: sku.features as Array<any>,
			cost: sku.price?.amount as number,
			currency: sku.price?.currency as string,
			currencyExponent: sku.price?.currency_exponent as number,
			releaseDate: sku.release_date as Date,
			accessType: sku.access_type as number,
			premium: sku.premium as boolean,
			nsfw: sku.show_age_gate as boolean,
		};

		this.client = client;
	}

	async consume() {
		if (this.consumed) return new XernerxError('This entitlement has already been consumed.');

		const request = await fetch(`https://discord.com/api/v10/applications/${this.clientId}/entitlements/${this.id}/consume`, {
			method: 'POST',
			headers: {
				'Authorization': `Bot ${this.client.token}`,
				'Content-Type': 'application/json',
			},
		});

		if (request.ok) {
			this.client.emit('skuConsumed', this.client, this);

			return { message: 'Entitlement consumed successfully.', code: 200, entitlement: this };
		}

		return (await request.json().then((error) => ({ ...(error as { message: string; code: number }), entitlement: this }))) as { message: string; code: number; entitlement: XernerxEntitlement };
	}
}
