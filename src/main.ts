import * as fs from 'fs';

import XernerxClient from './client/XernerxClient.js';
import MessageCommandBuilder from './build/MessageCommandBuilder.js';
import SlashCommandBuilder from './build/SlashCommandBuilder.js';
import ContextCommandBuilder from './build/ContextCommandBuilder.js';
import EventBuilder from './build/EventBuilder.js';
import InhibitorBuilder from './build/InhibitorBuilder.js';
import XernerxLog from './tools/XernerxLog.js';

export * from 'discord.js';
export * from 'dumfunctions';
import ExtensionBuilder from 'xernerx-extension-builder';

import Discord from 'discord.js';

const version = JSON.parse(fs.readFileSync('node_modules/xernerx/package.json', 'utf-8')).version;

export default XernerxClient;

export { XernerxClient, MessageCommandBuilder, SlashCommandBuilder, ContextCommandBuilder, EventBuilder, InhibitorBuilder, ExtensionBuilder, Discord, version, XernerxLog };
