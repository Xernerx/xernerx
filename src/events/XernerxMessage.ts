/** @format */

import { EventBuilder } from '../build/EventBuilder.js';

export class XernerxMessageEvent extends EventBuilder {
	constructor() {
		super('XernerxMessage', {
			name: 'message',
			emitter: 'process',
			once: false,
		});
	}

	override async run(message: { type: string; data: Record<string, number> }) {
		if (message.type !== 'xernerx') return;
	}
}
