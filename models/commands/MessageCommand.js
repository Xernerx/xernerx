const { s } = require('@sapphire/shapeshift');

/**
 * @param {string} name - The name of the command. @required
 * @param {string} aliases - Optional aliases of the command.
 * @param {string} description - The brief description of the command. @required
 * @param {string} detailedDescription - The detailed description of the command.
 * @param {boolean} owner - Wether the command can be executed by the bot owner only or not.
 * @param {boolean} admin - Wether the command can be executed by the guild admins only or not.
 * @param {string} channel - Wheter the command can only be executed in a DM, a Guild, or both.
 * @param {string} seperator - A string used to seperate arguments.
 */
class MessageCommand {
    constructor(id, options = {}) {

        s.object({
            name: s.string,
            aliases: s.array(s.string).optional,
            description: s.string,
            detailedDescription: s.string.optional,
            owner: s.boolean.optional,
            admin: s.boolean.optional,
            channel: s.string.optional,
            seperator: s.string.optional,
        }).parse(options);

        this.id = id;

        this.aliases = [...(options.aliases ? options.aliases : []), options.name];

        this.type = options.type;

        this.description = options.description;

        this.owner = options.owner;

        this.admin = options.admin;

        this.channel = options.channel;

        this.seperator = options.seperator;

        this.args = options.args;
    }

    exec(message) {
        /*
         * Make your custom command here.
         */
    }
}

module.exports = { MessageCommand };