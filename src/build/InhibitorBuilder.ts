/** @format */

import { BaseBuilder } from './BaseBuilder.js';
import { InhibitorBuilderOptions } from '../interfaces/InhibitorBuilderOptions.js';

export class InhibitorBuilder extends BaseBuilder {
	declare public readonly name: InhibitorBuilderOptions['name'];

	declare public readonly filetype: 'XernerxInhibitor';

	constructor(id: string, options: InhibitorBuilderOptions) {
		super(id, options);

		this.name = options.name;

		this.filetype = 'XernerxInhibitor';
	}

	async pre(...args: any): Promise<any> {}

	async post(...args: any): Promise<any> {}
}
