import { Event as EventType } from "../interfaces/HandlerInterfaces.js";
import { s } from "@sapphire/shapeshift";

export class Event {
	id: string;
	name: string;
	emitter?: string;
	type?: string;
	once?: boolean;

	constructor(id: string, options: EventType) {
		this.id = id;

		s.object({
			name: s.string,
			emitter: s.string.optional,
			type: s.string.optional,
			once: s.boolean.optional,
		}).parse(options);

		this.name = options.name;

		this.emitter = options.emitter || "client";

		this.type = options.type || "discord";

		this.once = options.once || false;
	}

	run() {
		/**
		 * @description run your custom event here.
		 */
	}
}
