const { s } = require('@sapphire/shapeshift');
const Discord = require('discord.js');

/**
 * @param {String} name - The name of the context menu;
 * @param {String || Number} type - The type of the context menu 1 || 2 - user || message 
 */
class ContextMenuCommand {
    constructor(id, options = {}) {

        s.object({
            name: s.string,
            type: s.string || s.number,
            inVoice: s.boolean.optional,
            owner: s.boolean.optional,
            admin: s.boolean.optional,
            info: s.string.optional,
            category: s.string.optional,
            channels: s.array(s.string).optional,
            guilds: s.array(s.string).optional,
            userPermissions: s.array(s.string).optional,
            clientPermissions: s.array(s.string).optional,
            description: s.string.optional
        }).parse(options)

        this.data = new Discord.ContextMenuCommandBuilder()
            .setName(options.name)
            .setType(this.types(options.type))

        this.inVoice = options.inVoice || false;

        this.category = options.category || undefined;

        this.owner = options.owner || false;

        this.admin = options.admin || false;

        this.info = options.info || undefined;

        this.channels = options.channels || [];

        this.guilds = options.guilds || [];

        this.userPermissions = options.userPermissions || [];

        this.clientPermissions = options.clientPermissions || [];

        this.config = options.config;

        this.description = options.description || undefined;
    }

    exec(interaction) {
        /*
         * Make your custom command here.
         */
    }

    types(str) {
        if (String(str)?.toLowerCase() == "message") str = 3;

        if (String(str)?.toLowerCase() == "user") str = 2;

        return str;
    }
}

module.exports = { ContextMenuCommand };