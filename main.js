const { Client } = require('./models/Client.js');
const { CommandHandler } = require('./models/handlers/CommandHandler.js');
const { EventHandler } = require('./models/handlers/EventHandler.js');
const { ErrorHandler } = require('./models/handlers/ErrorHandler.js');
const { MessageCommand } = require('./models/commands/MessageCommand.js');
const { InteractionCommand } = require('./models/commands/InteractionCommand.js')
const { Event } = require('./models/handlers/Event.js');
const { Error } = require('./models/handlers/Error.js');

module.exports = {
    // Client
    Client,

    // Handlers
    CommandHandler,
    EventHandler,
    ErrorHandler,

    // Commands
    MessageCommand,
    InteractionCommand,

    // Events
    Event,
    Error
} 