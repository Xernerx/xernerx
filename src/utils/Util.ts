/** @format */

import XernerxClient from '../client/XernerxClient.js';
import XernerxText from '../tools/XernerxText.js';

export default class Util {
	public declare readonly client;
	public declare readonly text;

	public constructor(client: XernerxClient) {
		this.client = client;

		this.text = new XernerxText();
	}

	public async delay(time: number) {
		return await new Promise((resolve) => setTimeout(resolve, time));
	}
}
