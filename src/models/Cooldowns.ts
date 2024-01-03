/** @format */

import { Collection } from 'discord.js';

import XernerxClient from '../client/XernerxClient.js';

export default class Cooldowns {
	private declare readonly _client;
	public declare readonly collections: Record<string, Collection<string, unknown>>;

	constructor(client: XernerxClient, collections: Array<string> = []) {
		this._client = client;

		this.collections = {
			commands: new Collection(),
		};

		for (const collection of collections) {
			this.collections[collection] = new Collection();
		}
	}

	add(collection: keyof typeof this.collections, id: string, value: unknown) {
		if (!this.collections[collection]) return `${collection} collection does not exist!`;

		return this.collections[collection].set(id, value);
	}

	delete(collection: keyof typeof this.collections, id: string) {
		if (!this.collections[collection]) return `${collection} collection does not exist!`;

		return this.collections[collection].delete(id);
	}

	has(id: string) {
		const collected: Record<string, Collection<string, unknown>> = {};

		for (const [name, collection] of Object.entries(this.collections)) {
			if (collection.has(id)) collected[name] = collection;
			else continue;
		}

		return collected;
	}
}
