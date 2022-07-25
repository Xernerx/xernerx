const { s } = require('@sapphire/shapeshift');
const Builders = require('@discordjs/builders');

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
        }).parse(options)

        this.data = new Builders.ContextMenuCommandBuilder()
            .setName(options.name)
            .setType(this.types(options.type))

        this.inVoice = options.inVoice;

        this.category = options.category;

        this.owner = options.owner;

        this.admin = options.admin;

        this.info = options.info;

        this.config = options.config;
    }

    exec(interaction) {
        /*
         * Make your custom command here.
         */
    }

    types(str) {
        if (String(str)?.toLowerCase() == "message") str = 3
        if (String(str)?.toLowerCase() == "user") str = 2
        return str
    }
}

module.exports = { ContextMenuCommand };