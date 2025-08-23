/** @format */

import ora from 'ora';
import sharpyy from 'sharpyy';

import { XernerxBase } from './XernerxBase.js';

export class XernerxError extends XernerxBase {
	constructor(message: string, exit: number = 0) {
		super();

		ora().fail(`${this.base()}${sharpyy(message, 'txRed')}`);

		exit ? process.exit(exit) : null;
	}
}
