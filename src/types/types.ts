/** @format */

import { XernerxContextCommand } from '../builders/XernerxContextCommand.js';
import { XernerxEvent } from '../builders/XernerxEvent.js';
import { XernerxInhibitor } from '../builders/XernerxInhibitor.js';
import { XernerxMessageCommand } from '../builders/XernerxMessageCommand.js';
import { XernerxSlashCommand } from '../builders/XernerxSlashCommand.js';

export type XernerxFileType = 'XernerxSlashCommand' | 'XernerxMessageCommand' | 'XernerxContextCommand' | 'XernerxEvent' | 'XernerxInhibitor';

export type XernerxFile<T = XernerxFileType> = T extends 'XernerxSlashCommand'
	? XernerxSlashCommand
	: T extends 'XernerxMessageCommand'
		? XernerxMessageCommand
		: T extends 'XernerxContextCommand'
			? XernerxContextCommand
			: T extends 'XernerxEvent'
				? XernerxEvent
				: T extends 'XernerxInhibitor'
					? XernerxInhibitor
					: XernerxSlashCommand | XernerxMessageCommand | XernerxSlashCommand | XernerxEvent | XernerxInhibitor;

export type XernerxCommand<T = XernerxFileType> = T extends 'XernerxSlashCommand'
	? XernerxSlashCommand
	: T extends 'XernerxMessageCommand'
		? XernerxMessageCommand
		: T extends 'XernerxContextCommand'
			? XernerxContextCommand
			: XernerxSlashCommand | XernerxMessageCommand | XernerxContextCommand;
