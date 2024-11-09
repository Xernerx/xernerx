/** @format */

import { XernerxEventOptions } from '../types/interfaces.js';
import { XernerxBaseBuilder } from './XernerxBaseBuilder.js';

export class XernerxEventBuilder extends XernerxBaseBuilder {
	public declare readonly collection: 'events';
	public declare readonly type;
	public declare readonly emitter;
	public declare readonly once;

	constructor(id: string, options: XernerxEventOptions) {
		super(id, options);

		this.collection = 'events';

		this.type = options.type;
		this.emitter = options.emitter;
		this.once = options.once;

		this.run = this.run;
	}

	public async run(...args: any) {}
}
