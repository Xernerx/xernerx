/** @format */

import { z } from 'zod';

import { XernerxEventOptions } from '../types/interfaces.js';

import { XernerxClientEvents, XernerxClientType } from '../types/extenders.js';
import XernerxLog from '../tools/XernerxLog.js';
import { Awaitable, RestEvents } from 'discord.js';

/**
 * @description - The event builder for  events.
 * @param {String} id - The unique ID of the event.
 * @param {EventOptions} options - The event options.
 */
export default class XernerxEvent<Event extends keyof XernerxClientEvents> {
	public declare readonly id: string;
	public declare readonly name: Event | keyof RestEvents | string;
	public declare readonly emitter?: 'client' | 'process' | 'rest' | string;
	public declare readonly type?: 'discord' | 'node' | string;
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

	public async run(...args: XernerxClientEvents[Event]): Promise<Awaitable<any>> {
		return new XernerxLog(this.client).error(`${this.id} doesn't have a run rule.`);
	}
}
