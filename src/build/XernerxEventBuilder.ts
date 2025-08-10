/** @format */

import { XernerxEventBuilderOptions } from '../interfaces/XernerxEventBuilderOptions.js';
import { XernerxBaseBuilder } from './XernerxBaseBuilder.js';

export class XernerxEventBuilder extends XernerxBaseBuilder {
	declare public readonly filetype: 'XernerxEvent';
	declare public readonly name: string;
	declare public readonly emitter: string;
	declare public readonly once: boolean;

	constructor(id: string, options: XernerxEventBuilderOptions) {
		super(id, options);

		this.filetype = 'XernerxEvent';

		this.name = options.name;

		this.emitter = options.emitter ?? 'client';

		this.once = options.once ?? false;
	}

	public async run(...args: any[]): Promise<void> {}
}
