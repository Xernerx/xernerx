/** @format */

import sharpyy from 'sharpyy';

export class XernerxBase {
	declare public readonly base: () => string;

	constructor() {
		this.base = () =>
			`| ${sharpyy('XERNERX', 'txRainbow', 'bold')} | ${new Date()
				.toLocaleTimeString()
				.split('')
				.map((c) => (Number.isNaN(Number(c)) ? sharpyy(c, 'txWhite') : sharpyy(c, 'txCyan')))
				.join('')} | ${sharpyy(String(Math.round(process.memoryUsage().rss / 1000000)), 'txCyan')}mb | `;
	}
}
