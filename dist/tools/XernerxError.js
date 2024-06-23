/** @format */
export default class XernerxError {
	name;
	message;
	stack;
	constructor(message, error) {
		this.name = 'XernerxError';
		this.message = message || null;
		this.stack = error || new Error().stack;
	}
}
