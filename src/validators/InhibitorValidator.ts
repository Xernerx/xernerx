/** @format */

import { XernerxClient } from '../main.js';

export class InhibitorValidator {
	constructor(public client: XernerxClient) {
		this.client = client;
	}

	async pre(name: string, ...args: any) {
		if (!this.client.inhibitors.has(name)) return;

		const inhibitor = this.client.inhibitors.get(name);

		return await inhibitor?.pre(...args);
	}

	async post(name: string, ...args: any) {
		if (!this.client.inhibitors.has(name)) return;

		const inhibitor = this.client.inhibitors.get(name);

		return await inhibitor?.post(...args);
	}
}
