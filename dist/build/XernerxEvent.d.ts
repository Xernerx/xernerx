/** @format */
import { XernerxEventOptions } from '../types/interfaces.js';
import { XernerxClientEvents, XernerxClientType } from '../types/extenders.js';
import { Awaitable, RestEvents } from 'discord.js';
/**
 * @description - The event builder for  events.
 * @param {String} id - The unique ID of the event.
 * @param {EventOptions} options - The event options.
 */
export default class XernerxEvent<Event extends keyof XernerxClientEvents> {
	readonly id: string;
	readonly name: Event | keyof RestEvents | string;
	readonly emitter?: 'client' | 'process' | 'rest' | string;
	readonly type?: 'discord' | 'node' | string;
	readonly once?: boolean;
	readonly filetype: 'Event';
	readonly filepath: string;
	readonly client: XernerxClientType;
	constructor(id: string, options: XernerxEventOptions);
	run(...args: XernerxClientEvents[Event]): Promise<Awaitable<any>>;
}
