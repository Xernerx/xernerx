const { s } = require('@sapphire/shapeshift');
class MessageCommand {
    constructor(id, options = {}) {

        s.object({
            name: s.string,
            aliases: s.array(s.string).optional,
            type: s.string,
            description: s.string,
            detailedDescription: s.string.optional,
            owner: s.boolean.optional,
            admin: s.boolean.optional,
            channel: s.string.optional
        }).parse(options);

        this.id = id;

        this.aliases = [...(options.aliases ? options.aliases : []), options.name];

        this.type = options.type;

        this.description = options.description;

        this.owner = options.owner;

        this.admin = options.admin;

        this.channel = options.channel;

        this.args = options.args;
    }

    exec(message) {

    }
}

module.exports = { MessageCommand };