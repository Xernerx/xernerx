/** @format */

import { XernerxEventBuilder } from '../build/XernerxEventBuilder.js';

export class XernerxEntitlementCreateEvent extends XernerxEventBuilder {
	constructor() {
		super('XernerxEntitlementCreateEvent', {
			name: 'entitlementCreate',
			emitter: 'client',
			once: false,
		});
	}

	override async run(a: any, b: any, c: any) {}
}
