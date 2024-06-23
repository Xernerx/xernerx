/** @format */
import { Collection } from 'discord.js';
import XernerxClient from '../client/XernerxClient.js';
export default class Cooldowns {
	private readonly _client;
	readonly collections: Record<string, Collection<string, unknown>>;
	constructor(client: XernerxClient, collections?: Array<string>);
	add(collection: keyof typeof this.collections, id: string, value: unknown): string | Collection<string, unknown>;
	delete(collection: keyof typeof this.collections, id: string): string | boolean;
	has(id: string): Record<string, Collection<string, unknown>>;
}
