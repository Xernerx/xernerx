/** @format */
import { Collection } from 'discord.js';
export default class Cooldowns {
	constructor(client, collections = []) {
		this._client = client;
		this.collections = {
			commands: new Collection(),
		};
		for (const collection of collections) {
			this.collections[collection] = new Collection();
		}
	}
	add(collection, id, value) {
		if (!this.collections[collection]) return `${collection} collection does not exist!`;
		return this.collections[collection].set(id, value);
	}
	delete(collection, id) {
		if (!this.collections[collection]) return `${collection} collection does not exist!`;
		return this.collections[collection].delete(id);
	}
	has(id) {
		const collected = {};
		for (const [name, collection] of Object.entries(this.collections)) {
			if (collection.has(id)) collected[name] = collection;
			else continue;
		}
		return collected;
	}
}
