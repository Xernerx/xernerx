/** @format */

import XernerxClient from '../client/XernerxClient.js';

export default class Util {
	public client;

	constructor(client: XernerxClient) {
		this.client = client;
	}

	public async delay(time: number) {
		return await new Promise((resolve) => setTimeout(resolve, time));
	}
}
