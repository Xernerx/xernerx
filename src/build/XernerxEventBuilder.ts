/** @format */

import { ClientEvents } from 'discord.js';
import sharpyy from 'sharpyy';

import { XernerxEventBuilderOptions } from '../interfaces/XernerxEventBuilderOptions.js';
import { XernerxBaseBuilder } from './XernerxBaseBuilder.js';
import { XernerxWarn } from '../tools/XernerxWarn.js';

export class XernerxEventBuilder extends XernerxBaseBuilder {
	declare public readonly filetype: 'XernerxEvent';
	declare public readonly name: ClientEvents | keyof ClientEvents | (string & {});
	declare public readonly emitter: string;
	declare public readonly once: boolean;

	constructor(id: string, options: XernerxEventBuilderOptions) {
		super(id, options);

		this.filetype = 'XernerxEvent';

		this.name = options.name;

		this.emitter = options.emitter ?? 'client';

		this.once = options.once ?? false;
	}

	/**
	 * Executes the event logic. This method should be overridden in subclasses to provide specific event handling.
	 *
	 * @param args - A variable number of arguments that are passed to the event handler.
	 *               These arguments are specific to the event being handled.
	 * @returns A promise that resolves when the event handling is complete.
	 *          The resolved value can be any type, depending on the implementation in subclasses.
	 */
	public async run(...args: any[]): Promise<any | void> {
		new XernerxWarn(`Event ${sharpyy(`${this.id}`, 'txYellow')} does not have a run method, and will therefore not work.`);
	}
}
