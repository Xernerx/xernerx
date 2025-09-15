/** @format */

import { XernerxEventBuilder } from '../build/XernerxEventBuilder.js';

export class XernerxMessageEvent extends XernerxEventBuilder {
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
