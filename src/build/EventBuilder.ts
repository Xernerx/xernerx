import { s } from '@sapphire/shapeshift';
import XernerxClient from '../client/XernerxClient.js';

import { EventOptions } from '../types/options.js';

/**
 * @description - The event builder for  events.
 * @param {String} id - The unique ID of the event.
 * @param {EventOptions} options - The event options.
 */
export default class EventBuilder {
	id: string;
	name: string;
	emitter?: string;
	type?: string;
	once?: boolean;
	client: XernerxClient | object;

	constructor(id: string, options: EventOptions) {
		this.id = id;

		s.object({
			name: s.string,
			emitter: s.string.optional,
			type: s.string.optional,
			once: s.boolean.optional,
		}).parse(options);

		this.name = options.name;

		this.emitter = options.emitter || 'client';

		this.type = options.type || 'discord';

		this.once = options.once || false;

		this.client = XernerxClient;

		this.run = this.run;
	}

	public async run() {
		/**
		 * @description run your custom event here.
		 */
	}
}
