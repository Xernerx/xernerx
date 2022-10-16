import { InhibitorOptions } from "../interfaces/HandlerInterfaces.js";
import { s } from "@sapphire/shapeshift";

/**
 * @description - The inhibitor builder for inhibitors.
 * @param {String} id - The unique ID of the inhibitor.
 * @param {InhibitorOptions} options - The inhibitor options.
 */
export class Inhibitor {
	id: string;
	name: string;
	type: string;

	constructor(id: string, options: InhibitorOptions) {
		this.id = id;

		s.object({
			name: s.string,
			type: s.string,
		}).parse(options);

		this.name = options.name;

		this.type = options.type;
	}
}
