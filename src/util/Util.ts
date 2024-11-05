/** @format */

import { XernerxClient } from '../main.js';

export class Util {
	public declare readonly client;

	constructor(client: XernerxClient) {
		this.client = client;
	}
}
