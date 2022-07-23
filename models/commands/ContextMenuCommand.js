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
        }).parse(options)

        this.data = new Builders.ContextMenuCommandBuilder()
            .setName(options.name)
            .setType(this.types(options.type))

        this.config = options.config;
    }

    exec(interaction) {
        /*
         * Make your custom command here.
         */
    }

    types(str) {
        if (str?.toLowerCase() == "message" || str?.toLowerCase() == "user") str == 1 ? (str = 1) : (str = 2);
        return str
    }
}

module.exports = { ContextMenuCommand };