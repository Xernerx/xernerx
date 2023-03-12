export var InhibitorType;
(function (InhibitorType) {
    InhibitorType["Member"] = "Member";
    InhibitorType["User"] = "User";
    InhibitorType["Guild"] = "Guild";
    InhibitorType["SlashCommand"] = "SlashCommand";
    InhibitorType["MessageCommand"] = "MessageCommand";
    InhibitorType["ContextCommand"] = "ContextCommand";
    InhibitorType["Command"] = "Command";
    InhibitorType["Message"] = "Message";
    InhibitorType["Interaction"] = "Interaction";
    InhibitorType["Channel"] = "Channel";
})(InhibitorType = InhibitorType || (InhibitorType = {}));
export var CommandType;
(function (CommandType) {
    CommandType["Message"] = "MessageCommand";
    CommandType["Slash"] = "SlashCommand";
    CommandType["Context"] = "ContextCommand";
    CommandType["Event"] = "Event";
    CommandType["Inhibitor"] = "Inhibitor";
    CommandType["MessageCommand"] = "MessageCommand";
    CommandType["SlashCommand"] = "SlashCommand";
    CommandType["ContextCommand"] = "ContextCommand";
})(CommandType = CommandType || (CommandType = {}));
export var ContextCommandType;
(function (ContextCommandType) {
    ContextCommandType[ContextCommandType["Message"] = 3] = "Message";
    ContextCommandType[ContextCommandType["User"] = 2] = "User";
})(ContextCommandType = ContextCommandType || (ContextCommandType = {}));
export var EventEmitterType;
(function (EventEmitterType) {
    EventEmitterType["Client"] = "client";
    EventEmitterType["Rest"] = "rest";
    EventEmitterType["Process"] = "process";
})(EventEmitterType = EventEmitterType || (EventEmitterType = {}));
