import XernerxClient from './client/XernerxClient.js';
import XernerxShardClient from './client/XernerxShardClient.js';
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
declare const version: any;
export default XernerxClient;
export { 
/**
 ** Clients
 */
XernerxClient, XernerxShardClient, 
/**
 ** Builders
 */
MessageCommandBuilder, SlashCommandBuilder, ContextCommandBuilder, EventBuilder, InhibitorBuilder, ExtensionBuilder, 
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
XernerxLog, };
//# sourceMappingURL=main.d.ts.map