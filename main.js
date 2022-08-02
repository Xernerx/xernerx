const { Client } = require('./models/Client.js'),
    { CommandHandler } = require('./models/handlers/CommandHandler.js'),
    { EventHandler } = require('./models/handlers/EventHandler.js'),
    { MessageCommand } = require('./models/commands/MessageCommand.js'),
    { InteractionCommand } = require('./models/commands/InteractionCommand.js'),
    { Event } = require('./models/commands/Event.js'),
    { LanguageHandler } = require('./models/handlers/LanguageHandler.js'),
    { ContextMenuCommand } = require('./models/commands/ContextMenuCommand.js'),
    pkg = require('./package.json'),
    Dumfunctions = require('dumfunctions'),
    Discord = require('discord.js');

module.exports = {
    // Client
    Client,

    // Handlers
    CommandHandler,
    EventHandler,
    LanguageHandler,

    // Commands
    MessageCommand,
    InteractionCommand,
    ContextMenuCommand,

    // Events
    Event,

    // Discord
    Discord,
    functions: Dumfunctions,

    // Details
    version: pkg.version,
} 