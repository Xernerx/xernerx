/** @format */

import { XernerxClient } from '../main.js';
import { XernerxBaseBuilderOptions } from '../types/interfaces.js';

export class XernerxBaseBuilder {
	declare public client: XernerxClient;
	declare public readonly id;
	declare public readonly name;
	declare public readonly description;
	declare public readonly filename: string;
	declare public readonly filepath: string;
	declare public readonly collection: string | null;

	constructor(id: string, options: XernerxBaseBuilderOptions) {
		this.id = id;

		this.name = options.name;

		this.description = options.description;

		this.collection = null;
	}
}
