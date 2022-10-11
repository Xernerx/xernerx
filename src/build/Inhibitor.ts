import { Inhibitor as InhibitorType } from "../interfaces/HandlerInterfaces.js";
import { s } from "@sapphire/shapeshift";

export class Inhibitor {
	id: string;
	name: string;
	type: string;

	constructor(id: string, options: InhibitorType) {
		this.id = id;

		s.object({
			name: s.string,
			type: s.string,
		}).parse(options);

		this.name = options.name;

		this.type = options.type;
	}
}
