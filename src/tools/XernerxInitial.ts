/** @format */

import ora from 'ora';
import boxen from 'boxen';
import sharpyy from 'sharpyy';

import { XernerxBase } from './XernerxBase.js';

export class XernerxInitial extends XernerxBase {
	constructor(type: 'Client' | 'ShardClient') {
		super();

		console.clear();

		console.info(
			boxen(sharpyy('XERNERX', 'txRainbow', 'bold'), {
				borderStyle: 'round',
				borderColor: 'magenta',
				textAlignment: 'center',
				fullscreen: (width, height) => [width, 4],
			})
		);

		const spinner = ora().start(`${this.base()}${type == 'Client' ? 'Starting...' : 'Sharding...'}`);

		setInterval(() => (spinner.text = `${this.base()}`), 500);
	}
}
