import Discord from "discord.js";

import XernerxClient from "./client/XernerxClient.js";

import { Event } from "./build/Event.js";
import { Inhibitor } from "./build/Inhibitor.js";
import { MessageCommand } from "./build/MessageCommand.js";
import { ContextCommand } from "./build/ContextCommand.js";
import { SlashCommand } from "./build/SlashCommand.js";
import { CommandType, EventEmitterType } from "./types/Types.js";
import { InhibitorType } from "./types/InhibitorTypes.js";

const version: string = "3.0.0";

export default {
	// Imported methods
	Discord,

	// Client
	Client: XernerxClient,
	XernerxClient,

	// Types
	CommandType,
	EventEmitterType,
	InhibitorType,

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

	// Client
	XernerxClient,

	// Types
	CommandType,
	EventEmitterType,
	InhibitorType,

	// Builds
	Event,
	MessageCommand,
	ContextCommand,
	SlashCommand,
	Inhibitor,

	// Constants
	version,
};
