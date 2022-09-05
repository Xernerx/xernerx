const { Client } = require('./models/Client.js'),
    { CommandHandler } = require('./models/handlers/CommandHandler.js'),
    { EventHandler } = require('./models/handlers/EventHandler.js'),
    { MessageCommand } = require('./models/commands/MessageCommand.js'),
    { InteractionCommand } = require('./models/commands/InteractionCommand.js'),
    { Event } = require('./models/commands/Event.js'),
    { Inhibitor } = require('./models/commands/Inhibitor.js'),
    { LanguageHandler } = require('./models/handlers/LanguageHandler.js'),
    { ContextMenuCommand } = require('./models/commands/ContextMenuCommand.js'),
    pkg = require('./package.json'),
    Dumfunctions = require('dumfunctions'),
    Discord = require('discord.js'),
    i18next = require('i18next');

const exp = {
    // Client
    XernerxClient: Client,

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

    Inhibitor,

    // Discord
    Discord,
    i18next,
    functions: Dumfunctions,

    // Details
    version: pkg.version,
}

for (const [key, val] of Object.entries(Discord)) {
    if (key == 'version') continue;

    exp[key] = val;
}

module.exports = exp;