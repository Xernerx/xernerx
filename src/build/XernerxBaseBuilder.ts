/** @format */

import { XernerxClient } from '../main.js';
import { XernerxBaseBuilderOptions } from '../types/interfaces.js';

export class XernerxBaseBuilder {
	public declare client: XernerxClient;
	public declare readonly id;
	public declare readonly name;
	public declare readonly description;
	public declare readonly filename: string;
	public declare readonly filepath: string;

	constructor(id: string, options: XernerxBaseBuilderOptions) {
		this.id = id;

		this.name = options.name;

		this.description = options.description;
	}
}
