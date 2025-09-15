/** @format */

import sharpyy from 'sharpyy';

export class XernerxBase {
	[index: string]: unknown;
	constructor() {
		// @ts-expect-error
		const x = process.xernerx;

		if (x)
			for (const [key, value] of Object.entries(x)) {
				this[key] = value;
			}
	}

	public base() {
		return `| ${sharpyy('XERNERX', 'txRainbow', 'bold')} | ${new Date()
			.toLocaleTimeString()
			.split('')
			.map((c) => (Number.isNaN(Number(c)) ? sharpyy(c, 'txWhite') : sharpyy(c, 'txCyan')))
			.join(
				''
			)} | ${this.pad(`${sharpyy(String(Math.round(process.memoryUsage().rss / 1000000)), 'txCyan')}mb`, 15)} | ${sharpyy(this.pad(this.id !== undefined ? `Shard ${this.id}` : 'Master', 10), 'txMagenta')} | ${sharpyy(this.pad(this.global ? 'global' : 'local', 7), this.global ? 'txGreen' : 'txRed')} | `;
	}

	private pad(str: string, length: number) {
		str = String(str);
		if (str.length > length) return str.slice(0, length);
		return str + ' '.repeat(length - str.length);
	}
}
