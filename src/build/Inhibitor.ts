import { InhibitorOptions } from "../interfaces/HandlerInterfaces.js";
import { s } from "@sapphire/shapeshift";
import { XernerxClient } from "../main.js";

/**
 * @description - The inhibitor builder for inhibitors.
 * @param {String} id - The unique ID of the inhibitor.
 * @param {InhibitorOptions} options - The inhibitor options.
 */
export class Inhibitor {
	id: string;
	name: string;
	type: string;
	client: XernerxClient | object;

	constructor(id: string, options: InhibitorOptions) {
		this.id = id;

		s.object({
			name: s.string,
			type: s.string,
		}).parse(options);

		this.name = options.name;

		this.type = options.type;

		this.client = {};

		this.check = this.check;
	}

	async check() {}
}
