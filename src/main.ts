import Discord from "discord.js";
import DumFunctions from "dumfunctions";

import XernerxClient from "./client/XernerxClient.js";
import { Event } from "./build/Event.js";
import { Inhibitor } from "./build/Inhibitor.js";
import { MessageCommand } from "./build/MessageCommand.js";
import { ContextCommand } from "./build/ContextCommand.js";
import { SlashCommand } from "./build/SlashCommand.js";
import { CommandType, EventEmitterType, ContextCommandType } from "./types/Types.js";
import { InhibitorType } from "./types/InhibitorTypes.js";
import pkg from "../package.js";

const version: string = pkg.version;

export default {
	// Imported methods
	Discord,
	DumFunctions,

	// Client
	Client: XernerxClient,
	XernerxClient,

	// Types
	CommandType,
	EventEmitterType,
	InhibitorType,
	ContextCommandType,

	// Builds
	Event,
	MessageCommand,
	ContextCommand,
	SlashCommand,
	Inhibitor,

	// Constants
	version,
};

export {
	// Imported methods
	Discord,
	DumFunctions,

	// Client
	XernerxClient,

	// Types
	CommandType,
	EventEmitterType,
	InhibitorType,
	ContextCommandType,

	// Builds
	Event,
	MessageCommand,
	ContextCommand,
	SlashCommand,
	Inhibitor,

	// Constants
	version,
};
