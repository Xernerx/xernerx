export default class XernerxError {
	public name: string;
	public message: string;

	constructor(message?: string) {
		this.name = 'XernerxError';

		this.message = message || '';
	}
}
