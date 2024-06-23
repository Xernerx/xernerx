/** @format */
export default class XernerxError {
	name: string;
	message: string | null;
	stack: {} | undefined;
	constructor(message?: string, error?: Error | unknown);
}
