import Discord from 'discord.js';
import DumFunctions from 'dumfunctions';

import XernerxClient from './client/XernerxClient.js';
import EventBuilder from './build/EventBuilder.js';
import InhibitorBuilder from './build/InhibitorBuilder.js';
import MessageCommandBuilder from './build/MessageCommandBuilder.js';
import ContextCommandBuilder from './build/ContextCommandBuilder.js';
import SlashCommandBuilder from './build/SlashCommandBuilder.js';
import { CommandType, EventEmitterType, ContextCommandType, InhibitorType } from './types/enums.js';
import XernerxError from './tools/XernerxError.js';
import ExtensionBuilder from './build/ExtensionBuilder.js';
import pkg from '../package.js';

const version: string = pkg.version;

export default {
	// Imported methods
	Discord,
	DumFunctions,

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
	version,
};

export {
	// Imported methods
	Discord,
	DumFunctions,

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
	version,
};
