const { s } = require('@sapphire/shapeshift');
const Builders = require('@discordjs/builders');


class ContextMenuCommand {
    constructor(id, options = {}) {

        s.object({
            name: s.string,
            type: s.string || s.number,
        }).parse(options)

        this.data = new Builders.ContextMenuCommandBuilder()
            .setName(options.name)
            .setType(this.types(options.type))
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