/** @format */

import { MonetizationAPI } from '@discordjs/core';
import { Client, RequestData, RESTGetAPIEntitlementsQuery } from 'discord.js';

export class XernerxMonitisation extends MonetizationAPI {
	declare private readonly client: Client<true>;

	constructor(client: Client<true>) {
		super(client.rest);

		this.client = client;
	}

	/**
	 * Consumes an entitlement based on the provided ID and options.
	 *
	 * @param id - The unique identifier of the entitlement to be consumed.
	 * @param options - Specifies the method of consumption, either 'auth' for authentication or 'signal' for signaling.
	 * @returns A promise that resolves when the entitlement is successfully consumed.
	 */
	consume(id: string, options: 'auth' | 'signal') {
		return this.consumeEntitlement(id, options);
	}

	/**
	 * Retrieves entitlements for the current user.
	 *
	 * @param id - An optional query object to filter entitlements.
	 * @param options - Optional request options specifying authentication or signaling method.
	 * @returns A promise that resolves with the entitlements for the current user.
	 */
	entitlements(id?: RESTGetAPIEntitlementsQuery, options?: Pick<RequestData, 'auth' | 'signal'>) {
		return this.getEntitlements(this.client.user.id, id || {}, options);
	}

	/**
	 * Retrieves the Stock Keeping Units (SKUs) for the current user.
	 *
	 * @param options - Optional request options specifying authentication or signaling method.
	 * @returns A promise that resolves with the SKUs for the current user.
	 */
	sku(options?: Pick<RequestData, 'auth' | 'signal'>) {
		return this.getSKUs(this.client.user.id, options);
	}

	/**
	 * Creates a test entitlement for the current user.
	 *
	 * @param id - The SKU identifier for which the test entitlement is to be created.
	 * @returns A promise that resolves when the test entitlement is successfully created.
	 */
	create(id: string) {
		return this.createTestEntitlement(this.client.user.id, { owner_id: this.client.user.id, owner_type: 1, sku_id: id });
	}

	/**
	 * Deletes a test entitlement for the current user.
	 *
	 * @param id - The unique identifier of the test entitlement to be deleted.
	 * @returns A promise that resolves when the test entitlement is successfully deleted.
	 */
	delete(id: string) {
		return this.deleteTestEntitlement(this.client.user.id, id);
	}
}
