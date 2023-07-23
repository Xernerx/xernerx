import * as fs from 'fs';

import XernerxClient from './client/XernerxClient.js';
import XernerxShardClient from './client/XernerxShardClient.js';
import XernerxMessageCommand from './build/XernerxMessageCommand.js';
import XernerxSlashCommand from './build/XernerxSlashCommand.js';
import XernerxContextCommand from './build/XernerxContextCommand.js';
import XernerxEvent from './build/XernerxEvent.js';
import XernerxInhibitor from './build/XernerxInhibitor.js';
import XernerxLog from './tools/XernerxLog.js';

export * from 'discord.js';
export * from 'dumfunctions';
import XernerxExtension from 'xernerx-extension-builder';

export * from './types/types.js';
export * from './types/extenders.js';
export * from './types/interfaces.js';

import Discord from 'discord.js';
import { Style } from 'dumfunctions';

const version = JSON.parse(fs.readFileSync('node_modules/xernerx/package.json', 'utf-8')).version;

const aVersion = await fetch('https://raw.githubusercontent.com/xernerx/xernerx/master/package.json')
    .then(async (res) => (await res.json()).version)
    .catch(() => version);

if (version != aVersion)
    new XernerxLog(true).warn(
        `A new version is available, you're using version ${Style.log(version, { color: Style.TextColor.Cyan })}, stable is ${Style.log(aVersion, {
            color: Style.TextColor.Cyan,
        })}, run ${Style.log(`npm i xernerx@${aVersion}`, { color: Style.BackgroundColor.Grey })} to update to the latest version`
    );

export default XernerxClient;

export {
    /**
     ** Clients
     */
    XernerxClient,
    XernerxShardClient,

    /**
     ** Builders
     */
    XernerxMessageCommand,
    XernerxSlashCommand,
    XernerxContextCommand,
    XernerxEvent,
    XernerxInhibitor,
    XernerxExtension,

    /**
     ** Imported exports
     */
    Discord,

    /**
     ** Properties
     */
    version,

    /**
     ** Tools
     */
    XernerxLog,
};
