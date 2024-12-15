/** @format */

import * as fs from 'fs';
import * as path from 'path';

import { XernerxClient } from '../main.js';

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

		if (Builder.collection) this.client.collections[Builder.collection as 'events'].set(Builder.id, Builder);

		return Builder;
	}

	protected readdir(path: string) {
		return fs.readdirSync(path).filter((file) => file.endsWith('.js') || file.endsWith('.mjs') || file.endsWith('.cjs'));
	}

	protected async on(builder: any) {
		const Builder = new builder();

		Builder.client = this.client;

		return await (Builder.once ? this.client.once(Builder.watch, (...args) => Builder.run(...args)) : this.client.on(Builder.watch, (...args) => Builder.run(...args)));
	}
}
