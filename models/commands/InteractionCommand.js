const { s } = require('@sapphire/shapeshift');
const { SlashCommandBuilder } = require('@discordjs/builders');

class InteractionCommand {
    constructor(id, options = {}) {

        s.object({
            name: s.string,
            description: s.string,
            detailedDescription: s.string.optional,
            owner: s.boolean.optional,
            admin: s.boolean.optional,
            channel: s.string.optional,
        }).parse(options);

        this.data = new SlashCommandBuilder()
            .setName(options.name)
            .setDescription(options.description)
        // this.data += options;

        this.id = id;

        this.owner = options.owner;

        this.admin = options.admin;

        this.channel = options.channel;

    }

    exec(interaction) {

    }
}

module.exports = { InteractionCommand };