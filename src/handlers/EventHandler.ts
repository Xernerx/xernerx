/** @format */

import { z } from 'zod';
import { Style } from 'dumfunctions';
import * as path from 'path';

import XernerxClient from '../client/XernerxClient.js';
import { EventHandlerOptions } from '../types/interfaces.js';
import Handler from './Handler.js';
import XernerxLog from '../tools/XernerxLog.js';
import { DiscordAPIError } from 'discord.js';
import XernerxEntitlement from '../models/XernerxEntitlement.js';

export default class EventHandler extends Handler {
	public declare readonly readyTimestamp;

	constructor(client: XernerxClient) {
		super(client);

		this.readyTimestamp = Number(Date.now());
	}

	public async loadEvents(options: EventHandlerOptions) {
		const events = [];

		options = z
			.object({
				directory: z.string(),
			})
			.parse(options);

		this.client.modules.options.events = options;

		const files = await this.readdir(options.directory, 'Events');

		for (const file of files) {
			const filepath = `${path.resolve(options.directory)}\\${file}`;

			const event = await this.load(filepath, 'Event');

			this.emit(event);

			events.push(event.id);
		}

		new XernerxLog(this.client).info(
			`Loaded ${Style.log(String(this.client.events.size), { color: Style.TextColor.Cyan })} Events: ${events.map((event) => Style.log(event, { color: Style.TextColor.LightYellow })).join(', ')}`
		);

		process.on('unhandledRejection', async (error: DiscordAPIError) => {
			if (this.client.settings.ceaseless) new XernerxLog(this.client).error('An uncaught error happpened, this is triggered from the ceaseless setting.', error);

			const data = {
				channel: null,
				message: null,
				user: null,
				url: error.url || null,
				stack: error.stack || error,
			} as any;

			if (error.url) {
				await error.url.match(/(channels|messages|servers|users)\/\d{10,100}/gim)?.map(async (identifier: string) => {
					const [type, id] = identifier.split('/');

					console.log(type, id);

					// switch (type) {
					// 	case 'channels':
					// 		return (data.channel = (await this.client.channels.fetch(id)) || id);
					// 	case ( 'messages' && data.channel):
					// 		return (data.message = (await data.channel.messages.cache.get(id)) || id);
					// 	case 'users':
					// 		return (data.user = (await this.client.users.fetch(id)) || id);
					// }
				});
			}

			this.client.emit('processError', this.client, data);
		});
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
}
