/** @format */

import { XernerxClient, XernerxEventBuilder } from '../main.js';
import XernerxEntitlement from '../model/XernerxEntitlement.js';
import { XernerxLog } from '../tools/XernerxLog.js';
import { XernerxEventHandlerOptions } from '../types/interfaces.js';
import { Handler } from './Handler.js';
import * as path from 'path';
import sharpyy from 'sharpyy';

export class EventHandler extends Handler {
	public readonly date: Date;

	constructor(client: XernerxClient) {
		super(client);

		this.date = new Date();
	}

	public async loadEvents(options: XernerxEventHandlerOptions) {
		try {
			await this.client.util.delay(options.delay || 0);

			XernerxLog.debug(`Loading events from: ${options.directory}...`);

			const dir = this.readdir(options.directory);

			for (const file of dir) {
				XernerxLog.debug(`Loading event: ${file}`);

				const filepath = path.resolve(options.directory, file);

				const builder = await this.load(filepath);

				this.run(builder);
			}

			XernerxLog.info(`Loaded events: ${this.client.collections.events.map((event) => sharpyy(event.name, 'txYellow')).join(', ')}`);
		} catch (error) {
			XernerxLog.error('Failed to load events.', error as Error);
		}
	}

	public async loadStore() {
		this.client.on('ready', () => this.store());
		this.client.on('entitlementCreate', () => this.store());
		this.client.on('entitlementUpdate', () => this.store());
		this.client.on('entitlementDelete', () => this.store());
	}

	private async store() {
		const entitlementsRequest = await fetch(`https://discord.com/api/v10/applications/${this.client.user?.id}/entitlements`, {
			headers: {
				'Authorization': `Bot ${this.client.token}`,
				'Content-Type': 'application/json',
			},
		});

		const SKUSRequest = await fetch(`https://discord.com/api/v10/applications/${this.client.user?.id}/skus`, {
			headers: {
				'Authorization': `Bot ${this.client.token}`,
				'Content-Type': 'application/json',
			},
		});

		if (!entitlementsRequest.ok) return;

		const entitlements = (await entitlementsRequest.json()) as any;

		if (!SKUSRequest.ok) return;

		const skus = (await SKUSRequest.json()) as any;

		const body = entitlements.map(
			(item: any) =>
				new XernerxEntitlement(
					this.client,
					skus.find((sku: any) => sku.id === item.sku_id),
					item
				)
		) as Array<XernerxEntitlement>;

		this.client.store = { front: skus, archive: body.filter((item) => item.consumed), items: body.filter((item) => !item.consumed) };
	}

	protected async run(builder: XernerxEventBuilder) {
		switch (builder.emitter) {
			case 'client':
				builder.once ? this.client.once(builder.name, (...args) => builder.run(...args)) : this.client.on(builder.name, (...args) => builder.run(...args));
				break;
			case 'process':
				builder.once ? process.once(builder.name, (...args) => builder.run(...args)) : process.on(builder.name, (...args) => builder.run(...args));
				break;
			case 'rest':
				builder.once ? this.client.rest.once(builder.name, (...args) => builder.run(...args)) : this.client.rest.on(builder.name, (...args) => builder.run(...args));
				break;
		}
	}
}
