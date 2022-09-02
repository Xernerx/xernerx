const { s } = require('@sapphire/shapeshift')

/**
 * @param {String} id - The id of the event. @required
 * @param {object} options - of the event. @required
 * @param {string} name - The name of the event. @required
 * @param {boolean} once - Whether the event should be ran once or continuously.
 */
class Inhibitor {
    constructor(id, options = {}) {
        s.object({
            name: s.string,
            type: s.string
        }).parse(options)

        this.id = id;

        this.name = options.name;

        this.type = options.type || undefined;

    }

    check(event) {
        /*
        * Make your custom event here.
        */
    }
}

module.exports = { Inhibitor };