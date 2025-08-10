/** @format */

import { XernerxClient } from '../client/XernerxClient.js';

export class XernerxBaseBuilder {
	declare public readonly id: string;
	declare public client: XernerxClient;

	constructor(id: string, options: any) {
		this.id = id;
	}
}
