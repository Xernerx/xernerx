/** @format */

import { exec } from 'child_process';
import readline from 'readline';
import { promisify } from 'node:util';
import pkg from '../../package.json' assert { type: 'json' };

const shell = promisify(exec);

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const question = rl.question('Adding tag?', (message) => {
	if (['y', 'yes'].includes(message.toLowerCase())) {
		shell(`git tag ${pkg.version}`);
		rl.close();
	} else if (['n', 'no'].includes(message.toLowerCase())) {
		console.log('Pushing without release.');
		rl.close();
	} else return question;
});
