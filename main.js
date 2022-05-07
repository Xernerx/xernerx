const { Client } = require('./models/Client.js'),
    { CommandHandler } = require('./models/handlers/CommandHandler.js'),
    { EventHandler } = require('./models/handlers/EventHandler.js'),
    { MessageCommand } = require('./models/commands/MessageCommand.js'),
    { InteractionCommand } = require('./models/commands/InteractionCommand.js'),
    { Event } = require('./models/handlers/Event.js');

module.exports = {
    // Client
    Client,

    // Handlers
    CommandHandler,
    EventHandler,

    // Commands
    MessageCommand,
    InteractionCommand,

    // Events
    Event,

} 