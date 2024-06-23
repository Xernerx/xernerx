/** @format */
import { z } from 'zod';
/**
 * @description - The inhibitor builder for inhibitors.
 * @param {String} id - The unique ID of the inhibitor.
 * @param {InhibitorOptions} options - The inhibitor options.
 */
export default class XernerxInhibitor {
	constructor(id, options) {
		this.id = id;
		z.object({
			name: z.string(),
			type: z.string(),
		}).parse(options);
		this.name = options.name;
		this.type = options.type;
		this.client = this.client;
	}
	pre(interaction, args) {}
	/**
	 * @description The check rule
	 * @param interaction - The interaction with the inhibitor, can be message and interaction
	 * @param args - The arguments parsed with this command
	 */
	async check(interaction, args, command) {}
	async post(interaction, args, command) {}
}
