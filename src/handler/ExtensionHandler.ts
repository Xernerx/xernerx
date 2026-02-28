/** @format */

import { BaseHandler } from './BaseHandler.js';
import { XernerxClient } from '../client/XernerxClient.js';
import { XernerxSuccess } from '../tools/XernerxSuccess.js';
import sharpyy from 'sharpyy';
import { XernerxError } from '../tools/XernerxError.js';

export class ExtensionHandler extends BaseHandler {
	constructor(client: XernerxClient) {
		super(client);
	}

	protected override async loadBuilder(builder: any): Promise<any> {
		if (!builder.id || builder.filetype !== 'XernerxExtension') return new XernerxError(`${builder.name || builder.constructor.name} is not a valid extension.`);

		builder.client = this.client;

		this.client.extensions.set(builder.id, builder);
	}

	async loadExtension(builder: any) {
		return await this.loadBuilder(builder);
	}

	async loadExtensions(...builders: any) {
		for (const builder of builders) {
			await this.loadExtension(builder);
		}

		new XernerxSuccess(`Loaded extensions: ${this.client.extensions.map((extension) => sharpyy(extension.id, 'txYellow')).join(', ')}`);
	}
}
