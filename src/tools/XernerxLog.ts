/** @format */

import sharpyy, { link } from 'sharpyy';

export default new (class XernerxLog {
	public declare readonly baseText;

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

	info(message: string) {
		return console.info(`✔️  |`, this.baseText, message);
	}

	async error(message: string, error?: Error) {
		const { default: boxen } = await import('boxen');

		const errorMessage = boxen(error?.stack as string, { padding: 1, margin: 1, borderStyle: 'round', borderColor: 'red' });

		if (error) return console.error(`❗ |`, this.baseText, message, errorMessage);
		else return console.error(`❗ |`, this.baseText, message);
	}

	warn(message: string, url?: URL) {
		console.warn(`⚠️  |`, this.baseText, message, url ? `Read more here ${link('here', url)}` : '');
	}

	debug(message: string) {
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
