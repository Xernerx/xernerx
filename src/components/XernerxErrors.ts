/** @format */

import sharpyy from 'sharpyy';

export class XernerxError extends Error {
	declare public readonly name: string;
	declare public readonly message: string;

	constructor(message: string) {
		super(message);
		this.name = 'XernerxError';

		this.message = sharpyy(`${message}`, 'bgRed');
	}
}
