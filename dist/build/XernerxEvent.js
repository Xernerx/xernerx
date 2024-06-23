/** @format */
import { z } from 'zod';
import XernerxLog from '../tools/XernerxLog.js';
/**
 * @description - The event builder for  events.
 * @param {String} id - The unique ID of the event.
 * @param {EventOptions} options - The event options.
 */
export default class XernerxEvent {
	constructor(id, options) {
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
	async run(...args) {
		return new XernerxLog(this.client).error(`${this.id} doesn't have a run rule.`);
	}
}
