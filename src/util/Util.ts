/** @format */

import { XernerxClient } from '../main.js';
import Markdown from './Markdown.js';

export class Util {
	declare public readonly client;
	declare public readonly markdown;

	constructor(client: XernerxClient) {
		this.client = client;

		this.markdown = new Markdown(client);
	}

	async delay(time: number) {
		return new Promise((resolve) => setTimeout(resolve, time));
	}
}
