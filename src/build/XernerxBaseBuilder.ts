/** @format */

import { XernerxClient } from '../client/XernerxClient.js';
import { XernerxEventBuilderOptions } from '../interfaces/XernerxEventBuilderOptions.js';
import { XernerxSlashCommandBuilderOptions } from '../interfaces/XernerxSlashCommandBuilderOptions.js';

export class XernerxBaseBuilder {
	declare public readonly id: string;
	declare public client: XernerxClient;

	constructor(id: string, options: XernerxSlashCommandBuilderOptions | XernerxEventBuilderOptions) {
		this.id = id;
	}
}
