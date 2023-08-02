/** @format */

import { z } from 'zod';

import { XernerxEventOptions } from '../dhkdkhmfg/interfaces.js';
import { XernerxEventType } from '../dhkdkhmfg/types.js';
import { XernerxClientType, XernerxLog } from '../main.js';

/**
 * @description - The event builder for  events.
 * @param {String} id - The unique ID of the event.
 * @param {EventOptions} options - The event options.
 */
export default class XernerxEvent {
	public declare readonly id: string;
	public declare readonly name: XernerxEventType | string;
	public declare readonly emitter?: 'client' | 'process' | string;
	public declare readonly type?: 'discord' | string;
	public declare readonly once?: boolean;
	public declare readonly filetype: 'Event';
	public declare readonly filepath: string;
	public declare readonly client: XernerxClientType;

	public constructor(id: string, options: XernerxEventOptions) {
		this.id = id;

		z.object({
			name: z.string(),
			emitter: z.string().optional(),
			type: z.string().optional(),
			once: z.boolean().optional(),
		}).parse(options);

		this.name = options.name;

		this.emitter = options.emitter || 'client';

		this.type = options.type || 'discord';

		this.once = options.once || false;

		this.client = this.client;
	}
	/**
	 * @description run your custom event here.
	 * @param any - there can be all kinds of parameters on events.
	 */
	public async run(...args: any): Promise<any> {
		return new XernerxLog(this.client).error(`${this.id} doesn't have a run rule.`);
	}
}
