import { EventOptions } from "../interfaces/HandlerInterfaces.js";
import { s } from "@sapphire/shapeshift";

/**
 * @description - The event builder for any events.
 * @param {String} id - The unique ID of the event.
 * @param {EventOptions} options - The event options.
 */
export class Event {
	id: string;
	name: string;
	emitter?: string;
	type?: string;
	once?: boolean;

	constructor(id: string, options: EventOptions) {
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
