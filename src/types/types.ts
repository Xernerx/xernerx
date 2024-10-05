/** @format */

import { XernerxContextCommand } from '../base/XernerxContextCommand.js';
import { XernerxEvent } from '../base/XernerxEvent.js';
import { XernerxInhibitor } from '../base/XernerxInhibitor.js';
import { XernerxMessageCommand } from '../base/XernerxMessageCommand.js';
import { XernerxSlashCommand } from '../base/XernerxSlashCommand.js';

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
