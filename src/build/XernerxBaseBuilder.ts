/** @format */

import { XernerxClient } from '../client/XernerxClient.js';
import { XernerxEventBuilderOptions } from '../interfaces/XernerxEventBuilderOptions.js';
import { XernerxSlashCommandBuilderOptions } from '../interfaces/XernerxSlashCommandBuilderOptions.js';

export class XernerxBaseBuilder {
	declare public readonly id: string;
	declare public client: XernerxClient;

	/**
	 * Constructs a new instance of the XernerxBaseBuilder class.
	 *
	 * @param id - A unique identifier for the builder instance.
	 * @param options - Configuration options for the builder, which can be either
	 *                  XernerxSlashCommandBuilderOptions or XernerxEventBuilderOptions.
	 */
	constructor(id: string, options: XernerxSlashCommandBuilderOptions | XernerxEventBuilderOptions) {
		this.id = id;
	}
}
