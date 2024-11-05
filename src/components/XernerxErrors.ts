/** @format */

import sharpyy from 'sharpyy';

export class XernerxError extends Error {
	public declare readonly name: string;
	public declare readonly message: string;

	constructor(message: string) {
		super(message);
		this.name = 'XernerxError';

		this.message = sharpyy(`${message}`, 'bgRed');
	}
}
