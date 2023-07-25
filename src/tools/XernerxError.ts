/** @format */

export default class XernerxError {
	public name;
	public message;
	public stack;

	constructor(message?: string, error?: Error | unknown) {
		this.name = 'XernerxError';

		this.message = message || null;

		this.stack = error || new Error().stack;
	}
}
