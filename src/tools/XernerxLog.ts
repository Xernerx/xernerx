/** @format */

import sharpyy, { link } from 'sharpyy';

export default new (class XernerxLog {
	public declare readonly baseText;
	public declare log: any;

	constructor() {
		this.baseText = `${sharpyy('XERNERX', 'txRainbow', 'bold')} | ${new Date()
			.toLocaleTimeString()
			.split(/ /gim)
			.map((str) =>
				str
					.split(':')
					.map((str) => (isNaN(Number(str)) ? str : sharpyy(str, 'txCyan')))
					.join(':')
			)
			.join(' ')} | ${sharpyy(String(Math.round(process.memoryUsage().rss / 10000) / 100), 'txCyan')}mb |`;
	}

	/**
	 * Logs an informational message to the console.
	 *
	 * @param message - The message to be logged.
	 *
	 * @returns - Returns nothing if the 'info' log level is not enabled. Otherwise, logs the message to the console.
	 *
	 * @example
	 * ```typescript
	 * xernerxLog.info('This is an informational message');
	 * ```
	 */
	public info(message: string) {
		if (!process.xernerx.log?.info) return;

		return console.info(`✔️  |`, this.baseText, message);
	}

	/**
	 * Logs error messages and optionally displays an error stack trace in a boxen format.
	 *
	 * @param message - The main error message to be logged.
	 * @param error - An optional Error object containing the error stack trace.
	 *
	 * @returns - Returns nothing if the 'error' log level is not enabled. Otherwise, logs the error message and stack trace (if provided) to the console.
	 *
	 * @example
	 * ```typescript
	 * xernerxLog.error('An error occurred while processing the request');
	 * xernerxLog.error('An error occurred while processing the request', new Error('Invalid input'));
	 * ```
	 */
	async error(message: string, error?: Error) {
		if (!process.xernerx.log?.error) return;

		const { default: boxen } = await import('boxen');

		const errorMessage = boxen(error?.stack as string, { padding: 1, margin: 1, borderStyle: 'round', borderColor: 'red' });

		if (error) return console.error(`❗ |`, this.baseText, message, errorMessage);
		else return console.error(`❗ |`, this.baseText, message);
	}

	/**
	 * Logs a warning message to the console, optionally with a link to more information.
	 *
	 * @param message - The warning message to be logged.
	 * @param url - An optional URL object representing the link to more information.
	 *
	 * @returns - Returns nothing if the 'warn' log level is not enabled. Otherwise, logs the warning message and link (if provided) to the console.
	 *
	 * @example
	 * ```typescript
	 * xernerxLog.warn('A warning occurred while processing the request');
	 * xernerxLog.warn('A warning occurred while processing the request', new URL('https://example.com/more-info'));+
	 * ```
	 */
	warn(message: string, url?: URL) {
		if (!process.xernerx.log?.warn) return;
		return console.warn(`⚠️  |`, this.baseText, message, url ? `Read more here ${link('here', url)}` : '');
	}

	/**
	 * Logs a debug message to the console.
	 *
	 * @param message - The debug message to be logged.
	 *
	 * @returns - Returns nothing if the 'debug' log level is not enabled. Otherwise, logs the debug message to the console.
	 *
	 * @example
	 * ```typescript
	 * xernerxLog.debug('This is a debug message');
	 * ```
	 */
	debug(message: string) {
		if (!process.xernerx.log?.debug) return;

		return console.debug(`🐛 |`, this.baseText, message);
	}

	async box(message: string, color?: string, title?: string) {
		const { default: boxen } = await import('boxen');

		const time = new Date()
			.toLocaleTimeString()
			.split(/ /gim)
			.map((str) =>
				str
					.split(':')
					.map((str) => (isNaN(Number(str)) ? str : sharpyy(str, 'txCyan')))
					.join(':')
			)
			.join(' ');

		return console.info(boxen(message, { padding: 1, margin: 1, borderStyle: 'round', borderColor: color, title: `${time} - ${sharpyy('XERNERX', 'txRainbow', 'bold')} - ${title || ''}` }));
	}
})();
