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

	// Custom methods
	Client: XernerxClient,
	version,
	CommandType,
	EventEmitterType,
	Event,
	MessageCommand,
	ContextCommand,
	SlashCommand,
	Inhibitor,
	InhibitorType,
};

export {
	// Imported methods
	Discord,

	// Custom methods
	XernerxClient,
	version,
	CommandType,
	Event,
	EventEmitterType,
	MessageCommand,
	ContextCommand,
	SlashCommand,
	Inhibitor,
	InhibitorType,
};
