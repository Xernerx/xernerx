/** @format */

import ora from 'ora';
import { XernerxBase } from './XernerxBase.js';

export class XernerxSuccess extends XernerxBase {
	constructor(message: string) {
		super();

		ora().succeed(`${this.base()}${message}`);
	}
}
