import {
    SlashCommandStringOption,
    SlashCommandNumberOption,
    SlashCommandIntegerOption,
    SlashCommandBooleanOption,
    SlashCommandUserOption,
    SlashCommandChannelOption,
    SlashCommandRoleOption,
    SlashCommandMentionableOption,
} from 'discord.js';
export declare enum InhibitorType {
    Member = 'Member',
    User = 'User',
    Guild = 'Guild',
    SlashCommand = 'SlashCommand',
    MessageCommand = 'MessageCommand',
    ContextCommand = 'ContextCommand',
    Command = 'Command',
    Message = 'Message',
    Interaction = 'Interaction',
    Channel = 'Channel',
}
export declare enum CommandType {
    Message = 'MessageCommand',
    Slash = 'SlashCommand',
    Context = 'ContextCommand',
    Event = 'Event',
    Inhibitor = 'Inhibitor',
    MessageCommand = 'MessageCommand',
    SlashCommand = 'SlashCommand',
    ContextCommand = 'ContextCommand',
}
export declare enum ContextCommandType {
    Message = 3,
    User = 2,
}
export declare enum EventEmitterType {
    Client = 'client',
    Rest = 'rest',
    Process = 'process',
}
export type SlashCommandOptionChoices = SlashCommandStringOption | SlashCommandNumberOption | SlashCommandIntegerOption;
export type SlashCommandOption = SlashCommandOptionChoices | SlashCommandBooleanOption | SlashCommandUserOption | SlashCommandChannelOption | SlashCommandRoleOption | SlashCommandMentionableOption;
export type SlashArgumentTypes = 'String' | 'Number' | 'Boolean' | 'User' | 'Channel' | 'Role' | 'Mentionable' | 'Integer';
