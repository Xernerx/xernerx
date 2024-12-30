/** @format */

import { XernerxClient } from '../main.js';

export default class Markdown {
	declare private readonly client: XernerxClient;

	constructor(client: XernerxClient) {
		this.client = client;
	}

	store(id?: string) {
		if (id) return `https://discord.com/application-directory/${this.client.user?.id}/store/${id}`;
		return `https://discord.com/application-directory/${this.client.user?.id}/store`;
	}
}
