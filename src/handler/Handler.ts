/** @format */

import * as fs from 'fs';
import * as path from 'path';

import { XernerxClient } from '../main.js';
// import { XernerxBaseBuilder } from '../build/XernerxBaseBuilder.js';

export class Handler {
	protected readonly client: XernerxClient;

	constructor(client: XernerxClient) {
		this.client = client;
	}

	protected async load(file: any) {
		const builder = (await import(`file://${file}`)) as any;

		const Builder = new builder.default();

		Builder.client = this.client;

		Builder.filename = path.basename(file);

		Builder.filepath = `file://${file}`;

		this.client.collections.events.set(Builder.id, Builder);

		return Builder;
	}

	protected readdir(path: string) {
		return fs.readdirSync(path).filter((file) => file.endsWith('.js') || file.endsWith('.mjs') || file.endsWith('.cjs'));
	}
}
