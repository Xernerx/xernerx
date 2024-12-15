/** @format */

import { XernerxEventOptions } from '../types/interfaces.js';
import { XernerxBaseBuilder } from './XernerxBaseBuilder.js';

export class XernerxEventBuilder extends XernerxBaseBuilder {
	declare public readonly collection: 'events';
	declare public readonly type;
	declare public readonly emitter;
	declare public readonly once;
	declare public readonly watch;

	constructor(id: string, options: XernerxEventOptions) {
		super(id, options);

		this.collection = 'events';

		this.type = options.type;

		this.emitter = options.emitter;

		this.once = options.once;

		this.watch = options.watch || this.name;

		this.run = this.run;
	}

	public async run(...args: any) {}
}
