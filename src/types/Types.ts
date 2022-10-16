export enum CommandType {
	Message = "MessageCommand",
	Slash = "SlashCommand",
	Context = "ContextCommand",
	Event = "Event",
	Inhibitor = "Inhibitor",
	MessageCommand = "MessageCommand",
	SlashCommand = "SlashCommand",
	ContextCommand = "ContextCommand",
}

export enum EventEmitterType {
	Client = "client",
	Rest = "rest",
	Process = "process",
}

export default {
	CommandType,
	EventEmitterType,
};
