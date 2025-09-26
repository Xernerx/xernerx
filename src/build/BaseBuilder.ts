/** @format */

import { ContextCommandBuilderOptions } from '../interfaces/ContextCommandBuilderOptions.js';
import { EventBuilderOptions } from '../interfaces/EventBuilderOptions.js';
import { InhibitorBuilderOptions } from '../interfaces/InhibitorBuilderOptions.js';
import { SlashCommandBuilderOptions } from '../interfaces/SlashCommandBuilderOptions.js';
import { XernerxClient } from '../client/XernerxClient.js';

export class BaseBuilder {
	declare public client: XernerxClient;

	/**
	 * Constructs a new instance of the XernerxBaseBuilder class.
	 *
	 * @param id - A unique identifier for the builder instance.
	 * @param options - Configuration options for the builder, which can be either
	 *                  XernerxSlashCommandBuilderOptions or XernerxEventBuilderOptions.
	 */
	constructor(
		public readonly id: string,
		options: SlashCommandBuilderOptions | EventBuilderOptions | ContextCommandBuilderOptions | InhibitorBuilderOptions
	) {
		this.id = id;
	}
}
