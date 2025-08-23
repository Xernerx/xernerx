/** @format */

import ora from 'ora';

import { XernerxBase } from './XernerxBase.js';

export class XernerxWarn extends XernerxBase {
	constructor(message: string) {
		super();

		ora().warn(`${this.base()}${message}`);
	}
}
