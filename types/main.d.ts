export * from 'discord.js';
export * from 'dumfunctions';
import ExtensionBuilder from 'xernerx-extension-builder';
import XernerxClient from './client/XernerxClient.js';
import EventBuilder from './build/EventBuilder.js';
import InhibitorBuilder from './build/InhibitorBuilder.js';
import MessageCommandBuilder from './build/MessageCommandBuilder.js';
import ContextCommandBuilder from './build/ContextCommandBuilder.js';
import SlashCommandBuilder from './build/SlashCommandBuilder.js';
import { CommandType, EventEmitterType, ContextCommandType, InhibitorType } from './types/enums.js';
import XernerxError from './tools/XernerxError.js';
declare const xernerxVersion: string;
declare const _default: {
    Client: typeof XernerxClient;
    XernerxClient: typeof XernerxClient;
    CommandType: typeof CommandType;
    EventEmitterType: typeof EventEmitterType;
    InhibitorType: typeof InhibitorType;
    ContextCommandType: typeof ContextCommandType;
    EventBuilder: typeof EventBuilder;
    MessageCommandBuilder: typeof MessageCommandBuilder;
    ContextCommandBuilder: typeof ContextCommandBuilder;
    SlashCommandBuilder: typeof SlashCommandBuilder;
    InhibitorBuilder: typeof InhibitorBuilder;
    ExtensionBuilder: typeof ExtensionBuilder;
    XernerxError: typeof XernerxError;
    version: string;
};
export default _default;
export {
    XernerxClient,
    CommandType,
    EventEmitterType,
    InhibitorType,
    ContextCommandType,
    EventBuilder,
    MessageCommandBuilder,
    ContextCommandBuilder,
    SlashCommandBuilder,
    InhibitorBuilder,
    ExtensionBuilder,
    XernerxError,
    xernerxVersion,
};
