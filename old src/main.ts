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
import pkg from './tools/package.js';
import sendWebhook from './functions/sendWebhook.js';

export const util = {
    sendWebhook,
};

const xernerxVersion: string = pkg.version;

export default {
    // Client
    Client: XernerxClient,
    XernerxClient,

    // Enums
    CommandType,
    EventEmitterType,
    InhibitorType,
    ContextCommandType,

    // Builds
    EventBuilder,
    MessageCommandBuilder,
    ContextCommandBuilder,
    SlashCommandBuilder,
    InhibitorBuilder,
    ExtensionBuilder,
    XernerxError,

    // Constants
    version: xernerxVersion,
};

export {
    // Client
    XernerxClient,

    // Enums
    CommandType,
    EventEmitterType,
    InhibitorType,
    ContextCommandType,

    // Builds
    EventBuilder,
    MessageCommandBuilder,
    ContextCommandBuilder,
    SlashCommandBuilder,
    InhibitorBuilder,
    ExtensionBuilder,
    XernerxError,

    // Constants
    xernerxVersion,
};
